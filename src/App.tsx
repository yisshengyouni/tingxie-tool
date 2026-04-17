import { useState, useRef, useCallback, useEffect } from 'react';
import './App.css';
import { Play, Pause, Volume2, Trash2, Share2, Check, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

function App() {
  const [words, setWords] = useState('');
  const [wordList, setWordList] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [repeatIndex, setRepeatIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(0.9);
  const [repeatCount, setRepeatCount] = useState(2);
  const [intervalSeconds, setIntervalSeconds] = useState(3);
  const [copied, setCopied] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [isWechat, setIsWechat] = useState(false);
  const [isAndroidWechat, setIsAndroidWechat] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resumeRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isPlayingRef = useRef(isPlaying);
  const speedRef = useRef(speed);
  const repeatCountRef = useRef(repeatCount);
  const intervalSecondsRef = useRef(intervalSeconds);
  const isAndroidWechatRef = useRef(isAndroidWechat);

  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
  useEffect(() => { speedRef.current = speed; }, [speed]);
  useEffect(() => { repeatCountRef.current = repeatCount; }, [repeatCount]);
  useEffect(() => { intervalSecondsRef.current = intervalSeconds; }, [intervalSeconds]);
  useEffect(() => { isAndroidWechatRef.current = isAndroidWechat; }, [isAndroidWechat]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (resumeRef.current) clearInterval(resumeRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // 检测是否微信浏览器
  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    const isWeixin = ua.includes('micromessenger');
    const isAndroid = ua.includes('android');
    setIsWechat(isWeixin);
    setIsAndroidWechat(isWeixin && isAndroid);
    console.log('[Env] UA:', navigator.userAgent);
    console.log('[Env] isWechat:', isWeixin, 'isAndroidWechat:', isWeixin && isAndroid);
    console.log('[Env] speechSynthesis:', 'speechSynthesis' in window);
    console.log('[Env] WeixinJSBridge:', typeof (window as typeof window & { WeixinJSBridge?: unknown }).WeixinJSBridge);
    if ('speechSynthesis' in window) {
      const voices = window.speechSynthesis.getVoices();
      console.log('[Env] voices count:', voices.length);
      console.log('[Env] voices:', voices.map(v => `${v.name}(${v.lang})`));
      window.speechSynthesis.onvoiceschanged = () => {
        const updated = window.speechSynthesis.getVoices();
        console.log('[Env] voices updated count:', updated.length);
      };
    }
  }, []);

  // 解析输入的生词
  const parseWords = (input: string) => {
    return input
      .split(/[,，\s、]+/)
      .map(w => w.trim())
      .filter(w => w.length > 0);
  };

  // 从URL加载数据
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedWords = params.get('words');
    const sharedSpeed = params.get('speed');
    const sharedRepeat = params.get('repeat');
    const sharedInterval = params.get('interval');

    if (sharedWords) {
      try {
        const decodedWords = decodeURIComponent(atob(sharedWords));
        setWords(decodedWords);
        setWordList(parseWords(decodedWords));
        if (sharedSpeed) setSpeed(Number(sharedSpeed));
        if (sharedRepeat) setRepeatCount(Number(sharedRepeat));
        if (sharedInterval) setIntervalSeconds(Number(sharedInterval));
        setIsShared(true);
      } catch (e) {
        console.error('Failed to parse shared words');
      }
    }
  }, []);

  // 微信 JSBridge 音频解锁通用方法
  const wechatUnlockAudio = (playFn: () => void) => {
    console.log('[wechatUnlockAudio] called');
    const wx = (window as typeof window & { WeixinJSBridge?: { invoke: (name: string, args: object, cb: () => void) => void } }).WeixinJSBridge;
    if (wx && wx.invoke) {
      console.log('[wechatUnlockAudio] WeixinJSBridge ready, invoking getNetworkType');
      wx.invoke('getNetworkType', {}, () => {
        console.log('[wechatUnlockAudio] getNetworkType callback');
        playFn();
      });
    } else {
      console.log('[wechatUnlockAudio] WeixinJSBridge not ready, waiting for WeixinJSBridgeReady');
      document.addEventListener('WeixinJSBridgeReady', () => {
        const wx2 = (window as typeof window & { WeixinJSBridge?: { invoke: (name: string, args: object, cb: () => void) => void } }).WeixinJSBridge;
        if (wx2 && wx2.invoke) {
          console.log('[wechatUnlockAudio] WeixinJSBridgeReady fired, invoking getNetworkType');
          wx2.invoke('getNetworkType', {}, () => {
            console.log('[wechatUnlockAudio] getNetworkType callback after ready');
            playFn();
          });
        } else {
          console.warn('[wechatUnlockAudio] WeixinJSBridge still missing after ready event');
          playFn();
        }
      }, false);
    }
  };

  // 初始化音频（解决微信自动播放限制）
  const initAudio = () => {
    console.log('[initAudio] called, isAndroidWechat:', isAndroidWechat);
    if (isAndroidWechat) {
      // Android 微信：必须通过 WeixinJSBridge 解锁音频
      wechatUnlockAudio(() => {
        const silentAudio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA');
        silentAudio.play().then(() => console.log('[initAudio] silentAudio play success')).catch((e) => console.error('[initAudio] silentAudio play error:', e));
        setAudioEnabled(true);
        console.log('[initAudio] audioEnabled set to true');
      });
      return;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();
      const utterance = new SpeechSynthesisUtterance('开始');
      utterance.lang = 'zh-CN';
      utterance.volume = 0.01;
      window.speechSynthesis.speak(utterance);
      setAudioEnabled(true);
    }
  };

  // Android 微信 fallback：使用有道 TTS 在线发音
  const playAudioFallback = useCallback((text: string, onEnd?: () => void) => {
    console.log('[playAudioFallback] text:', text);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    const url = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(text)}`;
    console.log('[playAudioFallback] audio url:', url);
    const audio = new Audio(url);
    audioRef.current = audio;
    audio.onended = () => {
      console.log('[playAudioFallback] audio ended');
      onEnd?.();
    };
    audio.onerror = (e) => {
      console.error('[playAudioFallback] audio error for:', text, e);
      onEnd?.();
    };
    audio.oncanplay = () => {
      console.log('[playAudioFallback] audio canplay');
    };

    const doPlay = () => {
      console.log('[playAudioFallback] doPlay called');
      audio.play().then(() => console.log('[playAudioFallback] audio play success')).catch((e) => {
        console.error('[playAudioFallback] audio play error:', e);
        onEnd?.();
      });
    };

    if (isAndroidWechatRef.current) {
      wechatUnlockAudio(doPlay);
    } else {
      doPlay();
    }
  }, []);

  // 语音合成
  const speakWord = useCallback((text: string, rate: number, onEnd?: () => void) => {
    console.log('[speakWord] text:', text, 'rate:', rate, 'isAndroidWechat:', isAndroidWechatRef.current);
    if (isAndroidWechatRef.current) {
      playAudioFallback(text, onEnd);
      return;
    }

    if (!('speechSynthesis' in window)) {
      console.warn('[speakWord] speechSynthesis not supported');
      onEnd?.();
      return;
    }

    window.speechSynthesis.cancel();
    window.speechSynthesis.resume();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = rate;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      console.log('[speakWord] Speech started:', text);
    };

    utterance.onend = () => {
      console.log('[speakWord] Speech ended:', text);
      onEnd?.();
    };

    utterance.onerror = (e) => {
      console.error('[speakWord] Speech error:', e);
      onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
  }, [playAudioFallback]);

  // iOS/微信兼容性：防止语音引擎被系统暂停后冻结
  const startResumeHack = () => {
    if (resumeRef.current) clearInterval(resumeRef.current);
    resumeRef.current = setInterval(() => {
      if ('speechSynthesis' in window && window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    }, 3000);
  };

  const stopResumeHack = () => {
    if (resumeRef.current) {
      clearInterval(resumeRef.current);
      resumeRef.current = null;
    }
  };

  // 停止播放
  const stopPlayback = () => {
    console.log('[stopPlayback] called');
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    stopResumeHack();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();
    }
    setIsPlaying(false);
    setCurrentIndex(0);
    setRepeatIndex(0);
  };

  // 顺序播放
  const playSequence = useCallback((list: string[], wordIdx: number, repeat: number) => {
    if (wordIdx >= list.length) {
      stopPlayback();
      return;
    }

    setCurrentIndex(wordIdx);
    setRepeatIndex(repeat);

    speakWord(list[wordIdx], speedRef.current, () => {
      if (!isPlayingRef.current) return;

      if (repeat < repeatCountRef.current) {
        timeoutRef.current = setTimeout(() => {
          playSequence(list, wordIdx, repeat + 1);
        }, intervalSecondsRef.current * 1000);
      } else {
        timeoutRef.current = setTimeout(() => {
          playSequence(list, wordIdx + 1, 1);
        }, intervalSecondsRef.current * 1000);
      }
    });
  }, [speakWord]);

  // 开始播放
  const startPlayback = () => {
    console.log('[startPlayback] called, isWechat:', isWechat, 'audioEnabled:', audioEnabled);
    if (isWechat && !audioEnabled) {
      initAudio();
    }

    const list = parseWords(words);
    console.log('[startPlayback] word list:', list);
    if (list.length === 0) return;

    setWordList(list);
    setIsPlaying(true);
    setCurrentIndex(0);
    setRepeatIndex(0);

    startResumeHack();

    // 同步播放第一个词，确保在用户手势事件内触发
    speakWord(list[0], speed, () => {
      if (!isPlayingRef.current) return;
      if (repeatCount > 1) {
        timeoutRef.current = setTimeout(() => {
          playSequence(list, 0, 2);
        }, intervalSeconds * 1000);
      } else {
        timeoutRef.current = setTimeout(() => {
          playSequence(list, 1, 1);
        }, intervalSeconds * 1000);
      }
    });
  };

  // 播放下一个
  const playNext = () => {
    if (currentIndex < wordList.length - 1) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      const next = currentIndex + 1;
      setCurrentIndex(next);
      setRepeatIndex(1);
      speakWord(wordList[next], speedRef.current, () => {
        if (!isPlayingRef.current) return;
        if (repeatCountRef.current > 1) {
          timeoutRef.current = setTimeout(() => {
            playSequence(wordList, next, 2);
          }, intervalSecondsRef.current * 1000);
        } else {
          timeoutRef.current = setTimeout(() => {
            playSequence(wordList, next + 1, 1);
          }, intervalSecondsRef.current * 1000);
        }
      });
    }
  };

  // 播放上一个
  const playPrev = () => {
    if (currentIndex > 0) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      const prev = currentIndex - 1;
      setCurrentIndex(prev);
      setRepeatIndex(1);
      speakWord(wordList[prev], speedRef.current, () => {
        if (!isPlayingRef.current) return;
        if (repeatCountRef.current > 1) {
          timeoutRef.current = setTimeout(() => {
            playSequence(wordList, prev, 2);
          }, intervalSecondsRef.current * 1000);
        } else {
          timeoutRef.current = setTimeout(() => {
            playSequence(wordList, prev + 1, 1);
          }, intervalSecondsRef.current * 1000);
        }
      });
    }
  };

  // 重播当前
  const replayCurrent = () => {
    if (wordList[currentIndex]) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      speakWord(wordList[currentIndex], speedRef.current, () => {
        if (!isPlayingRef.current) return;
        if (repeatCountRef.current > 1) {
          timeoutRef.current = setTimeout(() => {
            playSequence(wordList, currentIndex, 2);
          }, intervalSecondsRef.current * 1000);
        } else {
          timeoutRef.current = setTimeout(() => {
            playSequence(wordList, currentIndex + 1, 1);
          }, intervalSecondsRef.current * 1000);
        }
      });
    }
  };

  // 清空
  const clearAll = () => {
    stopPlayback();
    setWords('');
    setWordList([]);
    setCurrentIndex(0);
    setRepeatIndex(0);
    setIsShared(false);
    setAudioEnabled(false);
    window.history.replaceState({}, '', window.location.pathname);
  };

  // 分享
  const shareWords = () => {
    if (!words.trim()) return;
    
    const encodedWords = btoa(encodeURIComponent(words));
    const params = new URLSearchParams({
      words: encodedWords,
      speed: speed.toString(),
      repeat: repeatCount.toString(),
      interval: intervalSeconds.toString(),
    });
    
    const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const speedOptions = [
    { label: '慢', value: 0.6 },
    { label: '中', value: 0.9 },
    { label: '快', value: 1.2 },
  ];

  const repeatOptions = [
    { label: '1遍', value: 1 },
    { label: '2遍', value: 2 },
    { label: '3遍', value: 3 },
  ];

  const intervalOptions = [
    { label: '2秒', value: 2 },
    { label: '3秒', value: 3 },
    { label: '5秒', value: 5 },
    { label: '8秒', value: 8 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <div className="max-w-xl mx-auto pt-6">
        {/* 标题 */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-amber-700 mb-2">📝 生字听写</h1>
          <p className="text-amber-600">
            {isShared ? '已加载分享的内容，点击开始播放' : '输入生词，点击播放开始听写'}
          </p>
        </div>

        {/* 微信提示 */}
        {isWechat && !audioEnabled && (
          <div className="bg-orange-100 border-2 border-orange-300 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 text-orange-700 mb-2">
              <VolumeX className="w-5 h-5" />
              <span className="font-medium">微信浏览器提示</span>
            </div>
            <p className="text-orange-600 text-sm mb-3">
              微信需要点击"开启声音"按钮才能播放语音，或者点击右上角"在浏览器中打开"。
            </p>
            <Button
              onClick={initAudio}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            >
              <Volume2 className="w-4 h-4 mr-2" />
              开启声音
            </Button>
          </div>
        )}

        {/* 输入区域 */}
        <div className="bg-white rounded-2xl shadow-lg p-5 mb-4">
          <label className="block text-amber-700 font-medium mb-2">
            请输入生词（用逗号、空格或换行分隔）
          </label>
          <textarea
            value={words}
            onChange={(e) => {
              setWords(e.target.value);
              setWordList(parseWords(e.target.value));
              setIsShared(false);
            }}
            placeholder="例如：苹果，香蕉，橘子&#10;或者：春天 夏天 秋天 冬天"
            className="w-full h-28 p-4 border-2 border-amber-200 rounded-xl resize-none focus:outline-none focus:border-amber-400 text-lg"
            disabled={isPlaying}
          />
          {words && (
            <div className="mt-2 text-sm text-amber-500 flex justify-between">
              <span>共 {parseWords(words).length} 个生词</span>
              {isShared && <span className="text-green-500">✓ 来自分享</span>}
            </div>
          )}
        </div>

        {/* 配置选项 */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-4">
          <div className="grid grid-cols-3 gap-4">
            {/* 速度 */}
            <div>
              <span className="text-amber-700 text-sm font-medium block mb-2">朗读速度</span>
              <div className="flex flex-col gap-1">
                {speedOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSpeed(option.value)}
                    disabled={isPlaying}
                    className={`px-2 py-1.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50 ${
                      speed === option.value
                        ? 'bg-amber-500 text-white'
                        : 'bg-amber-100 text-amber-600 hover:bg-amber-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 重复次数 */}
            <div>
              <span className="text-amber-700 text-sm font-medium block mb-2">重复次数</span>
              <div className="flex flex-col gap-1">
                {repeatOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setRepeatCount(option.value)}
                    disabled={isPlaying}
                    className={`px-2 py-1.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50 ${
                      repeatCount === option.value
                        ? 'bg-amber-500 text-white'
                        : 'bg-amber-100 text-amber-600 hover:bg-amber-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 间隔时间 */}
            <div>
              <span className="text-amber-700 text-sm font-medium block mb-2">间隔时间</span>
              <div className="flex flex-col gap-1">
                {intervalOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setIntervalSeconds(option.value)}
                    disabled={isPlaying}
                    className={`px-2 py-1.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50 ${
                      intervalSeconds === option.value
                        ? 'bg-amber-500 text-white'
                        : 'bg-amber-100 text-amber-600 hover:bg-amber-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 播放控制和分享 */}
        <div className="flex gap-3 mb-4">
          {!isPlaying ? (
            <Button
              onClick={startPlayback}
              disabled={!words.trim()}
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-5 text-lg rounded-xl disabled:opacity-50"
            >
              <Play className="w-5 h-5 mr-2" />
              开始听写
            </Button>
          ) : (
            <Button
              onClick={stopPlayback}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-5 text-lg rounded-xl"
            >
              <Pause className="w-5 h-5 mr-2" />
              停止
            </Button>
          )}
          
          <Button
            onClick={shareWords}
            disabled={!words.trim()}
            variant="outline"
            className={`px-4 border-amber-300 rounded-xl ${
              copied ? 'bg-green-100 text-green-600 border-green-300' : 'text-amber-600 hover:bg-amber-50'
            }`}
          >
            {copied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
          </Button>
          
          <Button
            onClick={clearAll}
            variant="outline"
            className="px-4 border-amber-300 text-amber-600 hover:bg-amber-50 rounded-xl"
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>

        {/* 分享提示 */}
        {copied && (
          <div className="text-center text-green-600 text-sm mb-4">
            ✓ 链接已复制，分享给朋友即可！
          </div>
        )}

        {/* 播放状态 */}
        {isPlaying && wordList.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-amber-600">
                {currentIndex + 1} / {wordList.length}
              </span>
              <span className="text-amber-500 text-sm">
                第 {repeatIndex} / {repeatCount} 遍
              </span>
            </div>
            <div className="w-full h-3 bg-amber-100 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / wordList.length) * 100}%` }}
              />
            </div>
            <div className="flex gap-2 mb-4">
              <Button
                onClick={playPrev}
                disabled={currentIndex === 0}
                variant="outline"
                size="sm"
                className="flex-1 border-amber-300 text-amber-600"
              >
                上一个
              </Button>
              <Button
                onClick={replayCurrent}
                variant="outline"
                size="sm"
                className="flex-1 border-amber-300 text-amber-600"
              >
                <Volume2 className="w-4 h-4 mr-1" />
                重播
              </Button>
              <Button
                onClick={playNext}
                disabled={currentIndex === wordList.length - 1}
                variant="outline"
                size="sm"
                className="flex-1 border-amber-300 text-amber-600"
              >
                下一个
              </Button>
            </div>
            <div className="text-center bg-amber-50 rounded-xl py-6">
              <div className="text-5xl font-bold text-amber-700">
                {wordList[currentIndex]}
              </div>
              <div className="text-amber-400 text-sm mt-2">
                {repeatCount > 1 && `重复朗读中 (${repeatIndex}/${repeatCount})`}
              </div>
            </div>
          </div>
        )}

        {/* 词列表预览 */}
        {!isPlaying && wordList.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-5 mt-4">
            <h3 className="text-amber-700 font-medium mb-3">生词列表</h3>
            <div className="flex flex-wrap gap-2">
              {wordList.map((word, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm"
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 使用说明 */}
        <div className="mt-6 text-center text-amber-500 text-sm space-y-1">
          <p>💡 点击分享按钮复制链接，朋友打开即可直接播放</p>
          {isWechat && <p>🔊 微信用户请先点击"开启声音"按钮</p>}
        </div>
      </div>
    </div>
  );
}

export default App;

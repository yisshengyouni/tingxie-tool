export interface Character {
  id: number;
  char: string;
  pinyin: string;
  meaning: string;
  strokeCount: number;
}

export interface GradeLevel {
  grade: number;
  name: string;
  characters: Character[];
}

export const gradeData: GradeLevel[] = [
  {
    grade: 1,
    name: "一年级",
    characters: [
      { id: 1, char: "一", pinyin: "yī", meaning: "one", strokeCount: 1 },
      { id: 2, char: "二", pinyin: "èr", meaning: "two", strokeCount: 2 },
      { id: 3, char: "三", pinyin: "sān", meaning: "three", strokeCount: 3 },
      { id: 4, char: "十", pinyin: "shí", meaning: "ten", strokeCount: 2 },
      { id: 5, char: "人", pinyin: "rén", meaning: "person", strokeCount: 2 },
      { id: 6, char: "大", pinyin: "dà", meaning: "big", strokeCount: 3 },
      { id: 7, char: "小", pinyin: "xiǎo", meaning: "small", strokeCount: 3 },
      { id: 8, char: "口", pinyin: "kǒu", meaning: "mouth", strokeCount: 3 },
      { id: 9, char: "日", pinyin: "rì", meaning: "sun/day", strokeCount: 4 },
      { id: 10, char: "月", pinyin: "yuè", meaning: "moon/month", strokeCount: 4 },
      { id: 11, char: "水", pinyin: "shuǐ", meaning: "water", strokeCount: 4 },
      { id: 12, char: "火", pinyin: "huǒ", meaning: "fire", strokeCount: 4 },
      { id: 13, char: "木", pinyin: "mù", meaning: "wood/tree", strokeCount: 4 },
      { id: 14, char: "土", pinyin: "tǔ", meaning: "earth/soil", strokeCount: 3 },
      { id: 15, char: "山", pinyin: "shān", meaning: "mountain", strokeCount: 3 },
      { id: 16, char: "石", pinyin: "shí", meaning: "stone", strokeCount: 5 },
      { id: 17, char: "田", pinyin: "tián", meaning: "field", strokeCount: 5 },
      { id: 18, char: "禾", pinyin: "hé", meaning: "grain", strokeCount: 5 },
      { id: 19, char: "上", pinyin: "shàng", meaning: "up/above", strokeCount: 3 },
      { id: 20, char: "下", pinyin: "xià", meaning: "down/below", strokeCount: 3 },
    ]
  },
  {
    grade: 2,
    name: "二年级",
    characters: [
      { id: 21, char: "春", pinyin: "chūn", meaning: "spring", strokeCount: 9 },
      { id: 22, char: "夏", pinyin: "xià", meaning: "summer", strokeCount: 10 },
      { id: 23, char: "秋", pinyin: "qiū", meaning: "autumn", strokeCount: 9 },
      { id: 24, char: "冬", pinyin: "dōng", meaning: "winter", strokeCount: 5 },
      { id: 25, char: "风", pinyin: "fēng", meaning: "wind", strokeCount: 4 },
      { id: 26, char: "雨", pinyin: "yǔ", meaning: "rain", strokeCount: 8 },
      { id: 27, char: "雪", pinyin: "xuě", meaning: "snow", strokeCount: 11 },
      { id: 28, char: "云", pinyin: "yún", meaning: "cloud", strokeCount: 4 },
      { id: 29, char: "花", pinyin: "huā", meaning: "flower", strokeCount: 7 },
      { id: 30, char: "草", pinyin: "cǎo", meaning: "grass", strokeCount: 9 },
      { id: 31, char: "树", pinyin: "shù", meaning: "tree", strokeCount: 9 },
      { id: 32, char: "林", pinyin: "lín", meaning: "forest", strokeCount: 8 },
      { id: 33, char: "鸟", pinyin: "niǎo", meaning: "bird", strokeCount: 5 },
      { id: 34, char: "鱼", pinyin: "yú", meaning: "fish", strokeCount: 8 },
      { id: 35, char: "虫", pinyin: "chóng", meaning: "insect", strokeCount: 6 },
      { id: 36, char: "马", pinyin: "mǎ", meaning: "horse", strokeCount: 3 },
      { id: 37, char: "牛", pinyin: "niú", meaning: "cow", strokeCount: 4 },
      { id: 38, char: "羊", pinyin: "yáng", meaning: "sheep", strokeCount: 6 },
      { id: 39, char: "狗", pinyin: "gǒu", meaning: "dog", strokeCount: 8 },
      { id: 40, char: "猫", pinyin: "māo", meaning: "cat", strokeCount: 11 },
    ]
  },
  {
    grade: 3,
    name: "三年级",
    characters: [
      { id: 41, char: "学", pinyin: "xué", meaning: "study/learn", strokeCount: 8 },
      { id: 42, char: "校", pinyin: "xiào", meaning: "school", strokeCount: 10 },
      { id: 43, char: "老", pinyin: "lǎo", meaning: "old/teacher", strokeCount: 6 },
      { id: 44, char: "师", pinyin: "shī", meaning: "teacher", strokeCount: 6 },
      { id: 45, char: "同", pinyin: "tóng", meaning: "same/classmate", strokeCount: 6 },
      { id: 46, char: "朋", pinyin: "péng", meaning: "friend", strokeCount: 8 },
      { id: 47, char: "友", pinyin: "yǒu", meaning: "friend", strokeCount: 4 },
      { id: 48, char: "家", pinyin: "jiā", meaning: "home/family", strokeCount: 10 },
      { id: 49, char: "爸", pinyin: "bà", meaning: "dad", strokeCount: 8 },
      { id: 50, char: "妈", pinyin: "mā", meaning: "mom", strokeCount: 6 },
      { id: 51, char: "哥", pinyin: "gē", meaning: "older brother", strokeCount: 10 },
      { id: 52, char: "姐", pinyin: "jiě", meaning: "older sister", strokeCount: 8 },
      { id: 53, char: "弟", pinyin: "dì", meaning: "younger brother", strokeCount: 7 },
      { id: 54, char: "妹", pinyin: "mèi", meaning: "younger sister", strokeCount: 8 },
      { id: 55, char: "书", pinyin: "shū", meaning: "book", strokeCount: 4 },
      { id: 56, char: "本", pinyin: "běn", meaning: "book/measure word", strokeCount: 5 },
      { id: 57, char: "笔", pinyin: "bǐ", meaning: "pen", strokeCount: 10 },
      { id: 58, char: "纸", pinyin: "zhǐ", meaning: "paper", strokeCount: 7 },
      { id: 59, char: "课", pinyin: "kè", meaning: "lesson/class", strokeCount: 10 },
      { id: 60, char: "文", pinyin: "wén", meaning: "writing/language", strokeCount: 4 },
    ]
  },
  {
    grade: 4,
    name: "四年级",
    characters: [
      { id: 61, char: "时", pinyin: "shí", meaning: "time", strokeCount: 7 },
      { id: 62, char: "分", pinyin: "fēn", meaning: "minute/part", strokeCount: 4 },
      { id: 63, char: "秒", pinyin: "miǎo", meaning: "second", strokeCount: 9 },
      { id: 64, char: "年", pinyin: "nián", meaning: "year", strokeCount: 6 },
      { id: 65, char: "岁", pinyin: "suì", meaning: "years old", strokeCount: 6 },
      { id: 66, char: "早", pinyin: "zǎo", meaning: "early/morning", strokeCount: 6 },
      { id: 67, char: "晚", pinyin: "wǎn", meaning: "late/evening", strokeCount: 11 },
      { id: 68, char: "昨", pinyin: "zuó", meaning: "yesterday", strokeCount: 9 },
      { id: 69, char: "今", pinyin: "jīn", meaning: "today/now", strokeCount: 4 },
      { id: 70, char: "明", pinyin: "míng", meaning: "tomorrow/bright", strokeCount: 8 },
      { id: 71, char: "天", pinyin: "tiān", meaning: "day/sky", strokeCount: 4 },
      { id: 72, char: "星", pinyin: "xīng", meaning: "star", strokeCount: 9 },
      { id: 73, char: "期", pinyin: "qī", meaning: "period/week", strokeCount: 12 },
      { id: 74, char: "左", pinyin: "zuǒ", meaning: "left", strokeCount: 5 },
      { id: 75, char: "右", pinyin: "yòu", meaning: "right", strokeCount: 5 },
      { id: 76, char: "东", pinyin: "dōng", meaning: "east", strokeCount: 5 },
      { id: 77, char: "西", pinyin: "xī", meaning: "west", strokeCount: 6 },
      { id: 78, char: "南", pinyin: "nán", meaning: "south", strokeCount: 9 },
      { id: 79, char: "北", pinyin: "běi", meaning: "north", strokeCount: 5 },
      { id: 80, char: "中", pinyin: "zhōng", meaning: "middle/center", strokeCount: 4 },
    ]
  },
  {
    grade: 5,
    name: "五年级",
    characters: [
      { id: 81, char: "爱", pinyin: "ài", meaning: "love", strokeCount: 10 },
      { id: 82, char: "喜", pinyin: "xǐ", meaning: "like/happy", strokeCount: 12 },
      { id: 83, char: "欢", pinyin: "huān", meaning: "happy/joyful", strokeCount: 6 },
      { id: 84, char: "快", pinyin: "kuài", meaning: "fast/happy", strokeCount: 7 },
      { id: 85, char: "乐", pinyin: "lè", meaning: "happy/joy", strokeCount: 5 },
      { id: 86, char: "高", pinyin: "gāo", meaning: "tall/high", strokeCount: 10 },
      { id: 87, char: "兴", pinyin: "xìng", meaning: "excited/happy", strokeCount: 6 },
      { id: 88, char: "笑", pinyin: "xiào", meaning: "smile/laugh", strokeCount: 10 },
      { id: 89, char: "哭", pinyin: "kū", meaning: "cry", strokeCount: 10 },
      { id: 90, char: "生", pinyin: "shēng", meaning: "life/birth", strokeCount: 5 },
      { id: 91, char: "气", pinyin: "qì", meaning: "air/angry", strokeCount: 4 },
      { id: 92, char: "怕", pinyin: "pà", meaning: "afraid", strokeCount: 8 },
      { id: 93, char: "敢", pinyin: "gǎn", meaning: "dare", strokeCount: 11 },
      { id: 94, char: "勇", pinyin: "yǒng", meaning: "brave", strokeCount: 9 },
      { id: 95, char: "忙", pinyin: "máng", meaning: "busy", strokeCount: 6 },
      { id: 96, char: "闲", pinyin: "xián", meaning: "free/leisure", strokeCount: 7 },
      { id: 97, char: "累", pinyin: "lèi", meaning: "tired", strokeCount: 11 },
      { id: 98, char: "饿", pinyin: "è", meaning: "hungry", strokeCount: 10 },
      { id: 99, char: "饱", pinyin: "bǎo", meaning: "full", strokeCount: 8 },
      { id: 100, char: "渴", pinyin: "kě", meaning: "thirsty", strokeCount: 12 },
    ]
  },
  {
    grade: 6,
    name: "六年级",
    characters: [
      { id: 101, char: "美", pinyin: "měi", meaning: "beautiful", strokeCount: 9 },
      { id: 102, char: "丽", pinyin: "lì", meaning: "beautiful", strokeCount: 7 },
      { id: 103, char: "漂", pinyin: "piào", meaning: "pretty", strokeCount: 14 },
      { id: 104, char: "亮", pinyin: "liàng", meaning: "bright/shiny", strokeCount: 9 },
      { id: 105, char: "帅", pinyin: "shuài", meaning: "handsome", strokeCount: 5 },
      { id: 106, char: "丑", pinyin: "chǒu", meaning: "ugly", strokeCount: 4 },
      { id: 107, char: "胖", pinyin: "pàng", meaning: "fat", strokeCount: 9 },
      { id: 108, char: "瘦", pinyin: "shòu", meaning: "thin", strokeCount: 14 },
      { id: 109, char: "长", pinyin: "cháng", meaning: "long", strokeCount: 4 },
      { id: 110, char: "短", pinyin: "duǎn", meaning: "short", strokeCount: 12 },
      { id: 111, char: "圆", pinyin: "yuán", meaning: "round", strokeCount: 10 },
      { id: 112, char: "方", pinyin: "fāng", meaning: "square", strokeCount: 4 },
      { id: 113, char: "红", pinyin: "hóng", meaning: "red", strokeCount: 6 },
      { id: 114, char: "黄", pinyin: "huáng", meaning: "yellow", strokeCount: 11 },
      { id: 115, char: "蓝", pinyin: "lán", meaning: "blue", strokeCount: 13 },
      { id: 116, char: "绿", pinyin: "lǜ", meaning: "green", strokeCount: 11 },
      { id: 117, char: "白", pinyin: "bái", meaning: "white", strokeCount: 5 },
      { id: 118, char: "黑", pinyin: "hēi", meaning: "black", strokeCount: 12 },
      { id: 119, char: "金", pinyin: "jīn", meaning: "gold", strokeCount: 8 },
      { id: 120, char: "银", pinyin: "yín", meaning: "silver", strokeCount: 11 },
    ]
  }
];

export const getCharactersByGrade = (grade: number): Character[] => {
  const gradeLevel = gradeData.find(g => g.grade === grade);
  return gradeLevel?.characters || [];
};

export const getAllCharacters = (): Character[] => {
  return gradeData.flatMap(g => g.characters);
};

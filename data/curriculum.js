// Course content for all 40 days, kept separate from the UI so it can be edited
// without touching flow code. See docs/curriculum-design.md for the plan behind it.
import { MAGIC_E_SOUNDS } from './sounds.js';

export const STAGES = [
  { id: 'warmup', title: '暖身複習' },
  { id: 'phonics', title: 'Phonics 新字' },
  { id: 'sentences', title: '句子學習' },
  { id: 'speaking', title: '口說挑戰' },
  { id: 'wrapup', title: '收尾' },
];

// Review days teach nothing new: a longer warm-up, a role-play, then wrap-up.
export const REVIEW_STAGE_IDS = ['warmup', 'speaking', 'wrapup'];

// --- authoring helpers ---------------------------------------------------
const sentence = (text, translation, picture, parentTip) => ({ text, translation, picture, parentTip });
const word = (text, picture, chunks) => ({ text, picture, ...(chunks ? { chunks } : {}) });
const partner = (text, translation) => ({ who: 'partner', text, translation });
const child = (text, translation) => ({ who: 'child', text, translation });
const teach = (lesson) => ({ type: 'teach', ...lesson });
// scope 'unit' revisits the unit just finished; 'course' revisits everything taught so far.
const review = (dialogue, scope = 'unit') => ({ type: 'review', scope, dialogue });

const shortFamily = (rime) => ({
  rule: `-${rime} 字族`,
  hint: `「${rime}」是一組固定的音，前面換上不同的字母，就變成新的單字。`,
});

const magicE = (vowel) => ({
  rule: `${vowel}_e 魔法 e`,
  hint: `字尾的 e 不發音，但它會讓前面的 ${vowel} 唸出自己的名字。`,
  sounds: MAGIC_E_SOUNDS,
});

const emojiScene = (label, bg, items) => ({ label: `情境圖：${label}`, bg, items });

const UNIT_DEFS = [
  {
    id: 'greetings',
    title: '打招呼與自我介紹',
    scene: { name: 'morningMeet', label: '情境圖：早上遇見朋友' },
    sticker: { emoji: '👋', name: '打招呼貼紙' },
    days: [
      teach({
        rule: '-at 字族',
        hint: '字母 a 在這裡發短短的「ㄚ」音，後面接 t，就是 -at。',
        words: [word('cat', '🐱'), word('hat', '🎩'), word('mat', '🧶'), word('bat', '🦇')],
        sight: word('the', '👆'),
        sentences: [
          sentence('Good morning!', '早安！', '🌅', '早上見面時，輪流對彼此說 Good morning!'),
          sentence("Hello, I'm Mia.", '哈囉，我是米亞。', '👋', '請孩子把 Mia 換成自己的名字。'),
          sentence('Nice to meet you.', '很高興認識你。', '🤝', '遇到新朋友或親戚時提醒孩子說。'),
          sentence('How are you?', '你好嗎？', '😊', '放學回家時隨口問問看。'),
        ],
        dialogue: [
          partner('Good morning!', '早安！'),
          child('Good morning!', '早安！'),
          partner('How are you?', '你好嗎？'),
          child("I'm fine, thank you.", '我很好，謝謝。'),
          partner('Nice to meet you.', '很高興認識你。'),
          child('Nice to meet you, too.', '我也很高興認識你。'),
        ],
      }),
      teach({
        ...shortFamily('an'),
        words: [word('can', '🫙'), word('fan', '🌀'), word('man', '👨'), word('pan', '🍳')],
        sight: word('is', '✔️'),
        sentences: [
          sentence("I'm fine, thank you.", '我很好，謝謝。', '😄', '孩子被問 How are you? 時，鼓勵他用這句回答。'),
          sentence('And you?', '那你呢？', '🫵', '回答完之後，記得反問對方。'),
          sentence('Goodbye! See you tomorrow.', '再見！明天見。', '👋', '出門上學或睡前說再見時使用。'),
        ],
        dialogue: [
          partner('Hi! How are you?', '嗨！你好嗎？'),
          child("I'm fine, thank you. And you?", '我很好，謝謝。那你呢？'),
          partner("I'm good, too. It's time to go. Goodbye!", '我也很好。我該走了，再見！'),
          child('Goodbye! See you tomorrow.', '再見！明天見。'),
        ],
      }),
      teach({
        ...shortFamily('ig'),
        words: [word('big', '🐘'), word('pig', '🐷'), word('dig', '⛏️'), word('wig', '💇')],
        sight: word('I', '🙋'),
        sentences: [
          sentence("What's your name?", '你叫什麼名字？', '📛', '認識新朋友時可以問。'),
          sentence('My name is Leo.', '我的名字叫雷歐。', '🙋', '請孩子把 Leo 換成自己的名字。'),
          sentence('How old are you?', '你幾歲？', '🎂', "孩子也可以用 I'm nine. 這樣的短句回答。"),
        ],
        dialogue: [
          partner("Hello! I'm Mia. What's your name?", '哈囉！我是米亞。你叫什麼名字？'),
          child('My name is Leo.', '我的名字叫雷歐。'),
          partner('Nice name!', '好棒的名字！'),
          child('How old are you?', '你幾歲？'),
          partner("I'm eight years old.", '我八歲。'),
        ],
      }),
      review([
        partner('Good morning!', '早安！'),
        child('Good morning!', '早安！'),
        partner("I'm Mia. What's your name?", '我是米亞，你叫什麼名字？'),
        child('My name is Leo.', '我的名字叫雷歐。'),
        partner('Nice to meet you!', '很高興認識你！'),
        child('Nice to meet you, too.', '我也很高興認識你。'),
        partner('How are you?', '你好嗎？'),
        child("I'm fine, thank you.", '我很好，謝謝。'),
        partner('I have to go now. Goodbye!', '我得走了，再見！'),
        child('Goodbye! See you tomorrow.', '再見！明天見。'),
      ]),
    ],
  },
  {
    id: 'family',
    title: '家人與家裡',
    scene: emojiScene('一家人在家裡', '#ffe9d6', ['🏠', '👨‍👩‍👧‍👦', '🌷']),
    sticker: { emoji: '🏠', name: '家人貼紙' },
    days: [
      teach({
        ...shortFamily('ug'),
        words: [word('bug', '🐛'), word('hug', '🤗'), word('mug', '☕'), word('rug', '🟫')],
        sight: word('my', '🫶'),
        sentences: [
          sentence('This is my mom.', '這是我的媽媽。', '👩', '看全家福時，請孩子指著人說。'),
          sentence('This is my dad.', '這是我的爸爸。', '👨', '介紹家人時使用。'),
          sentence('I love my family.', '我愛我的家人。', '❤️', '睡前互相說一次。'),
        ],
        dialogue: [
          partner('Look! This is my mom.', '看！這是我的媽媽。'),
          child('This is my mom.', '這是我的媽媽。'),
          partner('And this is my dad.', '這位是我的爸爸。'),
          child('This is my dad.', '這是我的爸爸。'),
          partner('Do you love your family?', '你愛你的家人嗎？'),
          child('I love my family.', '我愛我的家人。'),
        ],
      }),
      teach({
        ...shortFamily('op'),
        words: [word('top', '🪀'), word('hop', '🐇'), word('mop', '🧹'), word('pop', '🍿')],
        sight: word('we', '👫'),
        sentences: [
          sentence("He's my brother.", '他是我的哥哥（弟弟）。', '👦', '指著家裡的男生說。'),
          sentence("She's my sister.", '她是我的姊姊（妹妹）。', '👧', '指著家裡的女生說。'),
          sentence("Let's go home.", '我們回家吧。', '🏠', '放學或出門玩回家時說。'),
        ],
        dialogue: [
          partner('Who is he?', '他是誰？'),
          child("He's my brother.", '他是我的哥哥（弟弟）。'),
          partner('And who is she?', '她是誰？'),
          child("She's my sister.", '她是我的姊姊（妹妹）。'),
          partner("It's getting late.", '時間有點晚了。'),
          child("Let's go home.", '我們回家吧。'),
        ],
      }),
      review([
        partner('Who is this?', '這是誰？'),
        child('This is my mom.', '這是我的媽媽。'),
        partner('And this one?', '那這位呢？'),
        child('This is my dad.', '這是我的爸爸。'),
        partner('Who is he?', '他是誰？'),
        child("He's my brother.", '他是我的哥哥（弟弟）。'),
        partner('Who is she?', '她是誰？'),
        child("She's my sister.", '她是我的姊姊（妹妹）。'),
        partner('You have a nice family!', '你有一個好棒的家！'),
        child('I love my family.', '我愛我的家人。'),
        partner('Time to go.', '該走囉。'),
        child("Let's go home.", '我們回家吧。'),
      ]),
    ],
  },
  {
    id: 'breakfast',
    title: '早晨與吃早餐',
    scene: emojiScene('早餐桌', '#fff3c4', ['🍞', '🥛', '🍳']),
    sticker: { emoji: '🍞', name: '早餐貼紙' },
    days: [
      teach({
        ...shortFamily('am'),
        words: [word('ham', '🍖'), word('jam', '🍓'), word('yam', '🍠'), word('ram', '🐏')],
        sight: word('you', '👉'),
        sentences: [
          sentence('Wake up!', '起床囉！', '⏰', '早上叫孩子起床時，可以讓他學著說。'),
          sentence('I brush my teeth.', '我刷牙。', '🪥', '刷牙時順口說一遍。'),
          sentence('Wash your face.', '洗臉。', '🧼', '提醒彼此洗臉。'),
        ],
        dialogue: [
          partner('Zzz... I am sleeping.', '呼……我在睡覺。'),
          child('Wake up!', '起床囉！'),
          partner('Oh, good morning! What do we do first?', '哦，早安！我們先做什麼？'),
          child('I brush my teeth.', '我刷牙。'),
          partner('And then?', '然後呢？'),
          child('Wash your face.', '洗臉。'),
        ],
      }),
      teach({
        ...shortFamily('un'),
        words: [word('bun', '🍞'), word('sun', '☀️'), word('fun', '🎉'), word('run', '🏃')],
        sight: word('to', '➡️'),
        sentences: [
          sentence('What do you want for breakfast?', '你早餐想吃什麼？', '🥣', '早餐前問問孩子。'),
          sentence('I want some milk.', '我想要一些牛奶。', '🥛', '孩子可以把 milk 換成別的食物。'),
          sentence("It's yummy!", '好好吃！', '😋', '吃到喜歡的東西時說。'),
        ],
        dialogue: [
          partner("It's breakfast time!", '早餐時間到了！'),
          child('What do you want for breakfast?', '你早餐想吃什麼？'),
          partner('I want a bun. How about you?', '我想吃小餐包。你呢？'),
          child('I want some milk.', '我想要一些牛奶。'),
          partner('Here you are.', '給你。'),
          child("It's yummy!", '好好吃！'),
        ],
      }),
      review([
        partner('Good morning! Time to get up.', '早安！該起床了。'),
        child('Good morning!', '早安！'),
        partner('What do we do first?', '我們先做什麼？'),
        child('I brush my teeth.', '我刷牙。'),
        partner('And then?', '然後呢？'),
        child('Wash your face.', '洗臉。'),
        partner("Let's eat breakfast!", '來吃早餐吧！'),
        child('What do you want for breakfast?', '你早餐想吃什麼？'),
        partner('I want a bun.', '我想吃小餐包。'),
        child('I want some milk.', '我想要一些牛奶。'),
        partner('How is it?', '好吃嗎？'),
        child("It's yummy!", '好好吃！'),
      ]),
    ],
  },
  {
    id: 'school',
    title: '學校與教室用語',
    scene: emojiScene('在教室裡', '#d6ecff', ['🏫', '👩‍🏫', '📚']),
    sticker: { emoji: '🏫', name: '學校貼紙' },
    days: [
      teach({
        ...shortFamily('ap'),
        words: [word('cap', '🧢'), word('map', '🗺️'), word('tap', '🚰'), word('nap', '😴')],
        sight: word('have', '✋'),
        sentences: [
          sentence("Let's go to school.", '我們去上學吧。', '🏫', '出門上學時說。'),
          sentence('This is my classroom.', '這是我的教室。', '🚪', '到學校時，請孩子介紹教室。'),
          sentence('Good morning, teacher!', '老師早！', '👩‍🏫', '進教室看到老師時說。'),
        ],
        dialogue: [
          partner("It's time for school!", '上學時間到了！'),
          child("Let's go to school.", '我們去上學吧。'),
          partner('Here we are.', '我們到了。'),
          child('This is my classroom.', '這是我的教室。'),
          partner('Look, there is our teacher!', '看，是我們的老師！'),
          child('Good morning, teacher!', '老師早！'),
        ],
      }),
      teach({
        ...shortFamily('it'),
        words: [word('sit', '🪑'), word('hit', '🔨'), word('fit', '💪'), word('kit', '🧰')],
        sight: word('are', '🔤'),
        sentences: [
          sentence('Please sit down.', '請坐下。', '🪑', '玩老師遊戲時，孩子可以當老師。'),
          sentence('Stand up, please.', '請站起來。', '🧍', '玩老師遊戲時使用。'),
          sentence('Open your book.', '請翻開你的書。', '📖', '一起看書前說。'),
        ],
        dialogue: [
          partner("Let's play teacher! You are the teacher.", '我們來玩老師遊戲！你當老師。'),
          child('Please sit down.', '請坐下。'),
          partner('OK! I am sitting.', '好！我坐好了。'),
          child('Open your book.', '請翻開你的書。'),
          partner('Done!', '好了！'),
          child('Stand up, please.', '請站起來。'),
        ],
      }),
      teach({
        ...shortFamily('in'),
        words: [word('pin', '📌'), word('tin', '🥫'), word('win', '🏆'), word('bin', '🗑️')],
        sight: word('do', '🙌'),
        sentences: [
          sentence('May I go to the toilet?', '我可以去上廁所嗎？', '🚻', '孩子在學校需要上廁所時說。'),
          sentence('May I drink water?', '我可以喝水嗎？', '💧', '想喝水時有禮貌地問。'),
          sentence('Can I borrow your pencil?', '我可以借你的鉛筆嗎？', '✏️', '跟同學借東西時使用。'),
        ],
        dialogue: [
          partner('I am the teacher now. What do you need?', '現在我是老師。你需要什麼？'),
          child('May I go to the toilet?', '我可以去上廁所嗎？'),
          partner('Yes, go ahead. Anything else?', '好，去吧。還有嗎？'),
          child('May I drink water?', '我可以喝水嗎？'),
          partner('Sure!', '當然可以！'),
          child('Can I borrow your pencil?', '我可以借你的鉛筆嗎？'),
          partner('Here you are.', '給你。'),
        ],
      }),
      review([
        partner('Good morning, class!', '同學們早安！'),
        child('Good morning, teacher!', '老師早！'),
        partner('Please come in and sit down.', '請進來坐好。'),
        child('This is my classroom.', '這是我的教室。'),
        partner('Do you need anything?', '你需要什麼嗎？'),
        child('May I go to the toilet?', '我可以去上廁所嗎？'),
        partner('Yes, you may.', '好，可以。'),
        child('May I drink water?', '我可以喝水嗎？'),
        partner('Yes, go ahead.', '好，去吧。'),
        child('Can I borrow your pencil?', '我可以借你的鉛筆嗎？'),
        partner('Of course. Here you are.', '當然。給你。'),
      ]),
    ],
  },
  {
    id: 'stationery',
    title: '文具與書包',
    scene: emojiScene('書包和文具', '#ffe0f0', ['🎒', '✏️', '📏']),
    sticker: { emoji: '✏️', name: '文具貼紙' },
    days: [
      teach({
        ...shortFamily('en'),
        words: [word('pen', '🖊️'), word('ten', '🔟'), word('hen', '🐔'), word('men', '👬')],
        sight: word('said', '💬'),
        sentences: [
          sentence('This is my pencil.', '這是我的鉛筆。', '✏️', '拿起文具時說出名稱。'),
          sentence('Where is my eraser?', '我的橡皮擦在哪裡？', '🧽', '找不到東西時使用。'),
          sentence("It's in my bag.", '它在我的書包裡。', '🎒', '回答東西在哪裡時說。'),
        ],
        dialogue: [
          partner('What is this?', '這是什麼？'),
          child('This is my pencil.', '這是我的鉛筆。'),
          partner('Good. Do you have an eraser?', '很好。你有橡皮擦嗎？'),
          child('Where is my eraser?', '我的橡皮擦在哪裡？'),
          partner('Look in your bag!', '看看你的書包！'),
          child("It's in my bag.", '它在我的書包裡。'),
        ],
      }),
      teach({
        ...shortFamily('ag'),
        words: [word('bag', '🎒'), word('tag', '🏷️'), word('wag', '🐕'), word('rag', '🧺')],
        sight: word('go', '🚶'),
        sentences: [
          sentence("What's in your bag?", '你的書包裡有什麼？', '🎒', '整理書包時問問孩子。'),
          sentence('I have a ruler.', '我有一把尺。', '📏', '孩子可以把 ruler 換成其他文具。'),
          sentence('Can I use your glue?', '我可以用你的膠水嗎？', '🧴', '向別人借用東西時說。'),
        ],
        dialogue: [
          partner('Wow, a big bag!', '哇，好大的書包！'),
          child("What's in your bag?", '你的書包裡有什麼？'),
          partner('A book and a pen. And you?', '一本書和一支筆。你呢？'),
          child('I have a ruler.', '我有一把尺。'),
          partner('Nice! I have glue.', '好棒！我有膠水。'),
          child('Can I use your glue?', '我可以用你的膠水嗎？'),
          partner('Sure!', '好啊！'),
        ],
      }),
      review([
        partner('Class is starting! Show me your pencil.', '要上課了！給我看你的鉛筆。'),
        child('This is my pencil.', '這是我的鉛筆。'),
        partner('Where is your eraser?', '你的橡皮擦在哪？'),
        child("It's in my bag.", '它在我的書包裡。'),
        partner('Oh, I forgot my things!', '哦，我忘了帶東西！'),
        child("What's in your bag?", '你的書包裡有什麼？'),
        partner('Only a book.', '只有一本書。'),
        child('I have a ruler.', '我有一把尺。'),
        partner('I need glue.', '我需要膠水。'),
        child('Can I use your glue?', '我可以用你的膠水嗎？'),
      ]),
    ],
  },
  {
    id: 'lunch',
    title: '點心與午餐',
    scene: emojiScene('午餐時間', '#e8ffd6', ['🍜', '🥤', '🍎']),
    sticker: { emoji: '🍱', name: '午餐貼紙' },
    days: [
      teach({
        ...shortFamily('ot'),
        words: [word('pot', '🍲'), word('hot', '🔥'), word('dot', '⚫'), word('cot', '🛏️')],
        sight: word('he', '👦'),
        sentences: [
          sentence("I'm hungry.", '我餓了。', '🍽️', '肚子餓時，請孩子用英文說。'),
          sentence("I'm thirsty.", '我渴了。', '🥤', '口渴時使用。'),
          sentence("Let's eat.", '我們來吃吧。', '🍴', '開動前說。'),
        ],
        dialogue: [
          partner("It's almost lunch time!", '快要中午了！'),
          child("I'm hungry.", '我餓了。'),
          partner('Me too! Are you thirsty?', '我也是！你渴嗎？'),
          child("I'm thirsty.", '我渴了。'),
          partner('Look, the table is ready.', '看，桌子準備好了。'),
          child("Let's eat.", '我們來吃吧。'),
        ],
      }),
      teach({
        ...shortFamily('ip'),
        words: [word('lip', '👄'), word('sip', '🥤'), word('tip', '💡'), word('zip', '🤐')],
        sight: word('she', '👧'),
        sentences: [
          sentence('Can I have some water?', '我可以喝一點水嗎？', '💧', '向人要東西時有禮貌地說。'),
          sentence('Here you are.', '給你。', '🤲', '遞東西給別人時說。'),
          sentence('Thank you.', '謝謝你。', '🙏', '收到東西時說。'),
        ],
        dialogue: [
          partner('You look thirsty.', '你看起來很渴。'),
          child('Can I have some water?', '我可以喝一點水嗎？'),
          partner('Sure. Here you are.', '當然。給你。'),
          child('Thank you.', '謝謝你。'),
          partner("You're welcome. Can I have some juice?", '不客氣。我可以喝一點果汁嗎？'),
          child('Here you are.', '給你。'),
        ],
      }),
      teach({
        ...shortFamily('ut'),
        words: [word('nut', '🥜'), word('cut', '✂️'), word('hut', '🛖'), word('but', '🤷')],
        sight: word('they', '👥'),
        sentences: [
          sentence('Do you like noodles?', '你喜歡麵嗎？', '🍜', '吃飯前問問孩子喜歡什麼。'),
          sentence('Yes, I do.', '是的，我喜歡。', '👍', '被問喜不喜歡時回答。'),
          sentence('No, thank you.', '不用了，謝謝。', '🙅', '有禮貌地拒絕別人時說。'),
        ],
        dialogue: [
          partner('Look at my lunch!', '看我的午餐！'),
          child('Do you like noodles?', '你喜歡麵嗎？'),
          partner('Yes, I do! Do you?', '是的，我喜歡！你呢？'),
          child('Yes, I do.', '是的，我喜歡。'),
          partner('Do you want some carrots?', '你想要一些紅蘿蔔嗎？'),
          child('No, thank you.', '不用了，謝謝。'),
        ],
      }),
      review([
        partner("It's lunch time!", '午餐時間到了！'),
        child("I'm hungry.", '我餓了。'),
        partner('Are you thirsty?', '你渴嗎？'),
        child('Can I have some water?', '我可以喝一點水嗎？'),
        partner('Here you are.', '給你。'),
        child('Thank you.', '謝謝你。'),
        partner('Do you like noodles?', '你喜歡麵嗎？'),
        child('Yes, I do.', '是的，我喜歡。'),
        partner('Do you want some carrots?', '你想要一些紅蘿蔔嗎？'),
        child('No, thank you.', '不用了，謝謝。'),
        partner("OK, let's eat!", '好，開動吧！'),
        child("Let's eat.", '我們來吃吧。'),
      ]),
    ],
  },
  {
    id: 'games',
    title: '玩遊戲與運動',
    scene: emojiScene('操場上玩遊戲', '#d6fff1', ['⚽', '🏃', '🪁']),
    sticker: { emoji: '⚽', name: '遊戲貼紙' },
    days: [
      teach({
        ...shortFamily('og'),
        words: [word('dog', '🐶'), word('jog', '🏃‍♀️'), word('log', '🪵'), word('fog', '🌫️')],
        sight: word('was', '🕰️'),
        sentences: [
          sentence("Let's play!", '我們來玩吧！', '🎮', '約同學或家人一起玩時說。'),
          sentence("It's my turn.", '輪到我了。', '🙋', '玩遊戲輪流時使用。'),
          sentence('Your turn.', '輪到你了。', '👉', '讓對方玩時說。'),
        ],
        dialogue: [
          partner("It's recess! What do you want to do?", '下課了！你想做什麼？'),
          child("Let's play!", '我們來玩吧！'),
          partner('Who goes first?', '誰先？'),
          child("It's my turn.", '輪到我了。'),
          partner('Great shot!', '好球！'),
          child('Your turn.', '輪到你了。'),
        ],
      }),
      teach({
        ...shortFamily('et'),
        words: [word('pet', '🐹'), word('net', '🥅'), word('wet', '💧'), word('set', '🍽️')],
        sight: word('what', '❓'),
        sentences: [
          sentence('I can run fast.', '我可以跑得很快。', '🏃', '孩子也可以換成 jump、swim 等動作。'),
          sentence('Can you jump?', '你會跳嗎？', '🦘', '問別人會不會做某件事。'),
          sentence('Good job!', '做得好！', '👏', '看到別人做得好時稱讚。'),
        ],
        dialogue: [
          partner("Let's race!", '我們來賽跑！'),
          child('I can run fast.', '我可以跑得很快。'),
          partner('Me too! I can jump.', '我也是！我會跳。'),
          child('Can you jump?', '你會跳嗎？'),
          partner('Watch me! Hop!', '看我！跳！'),
          child('Good job!', '做得好！'),
        ],
      }),
      review([
        partner("It's recess time!", '下課時間到了！'),
        child("Let's play!", '我們來玩吧！'),
        partner('Who goes first?', '誰先？'),
        child("It's my turn.", '輪到我了。'),
        partner('Wow, you are fast!', '哇，你好快！'),
        child('I can run fast.', '我可以跑得很快。'),
        partner('Now it is my turn.', '現在輪到我了。'),
        child('Your turn.', '輪到你了。'),
        partner('Look! I can jump!', '看！我會跳！'),
        child('Good job!', '做得好！'),
      ]),
    ],
  },
  {
    id: 'likes',
    title: '喜歡與不喜歡',
    scene: emojiScene('喜歡的東西', '#ffd6d6', ['🍰', '❤️', '🐶']),
    sticker: { emoji: '❤️', name: '喜好貼紙' },
    days: [
      teach({
        ...magicE('a'),
        words: [word('cake', '🎂'), word('make', '🔨'), word('lake', '🏞️'), word('name', '📛')],
        sight: word('where', '📍'),
        sentences: [
          sentence('I like cake.', '我喜歡蛋糕。', '🎂', '孩子可以換成自己喜歡的食物。'),
          sentence("I don't like carrots.", '我不喜歡紅蘿蔔。', '🥕', '說出不喜歡的東西。'),
          sentence('Do you like apples?', '你喜歡蘋果嗎？', '🍎', '買水果或點心時問問看。'),
        ],
        dialogue: [
          partner('Look at this cake!', '看這個蛋糕！'),
          child('I like cake.', '我喜歡蛋糕。'),
          partner("I don't like carrots. Do you?", '我不喜歡紅蘿蔔。你呢？'),
          child("I don't like carrots.", '我不喜歡紅蘿蔔。'),
          partner('Me neither! What about apples?', '我也是！那蘋果呢？'),
          child('Do you like apples?', '你喜歡蘋果嗎？'),
          partner('Yes, I do!', '是的，我喜歡！'),
        ],
      }),
      teach({
        ...magicE('i'),
        words: [word('like', '👍'), word('bike', '🚲'), word('kite', '🪁'), word('five', '5️⃣')],
        sight: word('who', '🧑'),
        sentences: [
          sentence("What's your favorite color?", '你最喜歡什麼顏色？', '🌈', '聊天時問問孩子。'),
          sentence('My favorite animal is a dog.', '我最喜歡的動物是狗。', '🐶', '孩子可以換成自己最喜歡的動物。'),
          sentence('Me too!', '我也是！', '🙌', '遇到跟自己一樣的想法時說。'),
        ],
        dialogue: [
          partner('Do you have a favorite animal?', '你有最喜歡的動物嗎？'),
          child('My favorite animal is a dog.', '我最喜歡的動物是狗。'),
          partner('Cool! Mine is a cat.', '好酷！我最喜歡貓。'),
          child("What's your favorite color?", '你最喜歡什麼顏色？'),
          partner("It's blue.", '是藍色。'),
          child('Me too!', '我也是！'),
        ],
      }),
      review([
        partner('Look at this cake!', '看這個蛋糕！'),
        child('I like cake.', '我喜歡蛋糕。'),
        partner('What about carrots?', '那紅蘿蔔呢？'),
        child("I don't like carrots.", '我不喜歡紅蘿蔔。'),
        partner('I like apples.', '我喜歡蘋果。'),
        child('Do you like apples?', '你喜歡蘋果嗎？'),
        partner('Yes, I do. What is your favorite animal?', '是的，我喜歡。你最喜歡什麼動物？'),
        child('My favorite animal is a dog.', '我最喜歡的動物是狗。'),
        partner('Mine is a dog, too!', '我最喜歡的也是狗！'),
        child('Me too!', '我也是！'),
      ]),
    ],
  },
  {
    id: 'weather',
    title: '天氣與穿著',
    scene: emojiScene('天氣和衣服', '#d6e4ff', ['☀️', '🌧️', '🧥']),
    sticker: { emoji: '☀️', name: '天氣貼紙' },
    days: [
      teach({
        rule: 'ai / ay 發長音 ay',
        hint: 'ai 和 ay 都唸成「ㄟ」。ai 通常在字中間，ay 通常在字尾。',
        words: [word('rain', '🌧️', ['r', 'ai', 'n']), word('train', '🚆', ['t', 'r', 'ai', 'n']), word('play', '🎮', ['p', 'l', 'ay']), word('day', '🌞', ['d', 'ay'])],
        sight: word('come', '🏃‍♂️'),
        sentences: [
          sentence("It's sunny today.", '今天是晴天。', '☀️', '出門前看窗外說天氣。'),
          sentence("It's raining.", '正在下雨。', '🌧️', '下雨天時使用。'),
          sentence("It's cold.", '很冷。', '🥶', '覺得冷時說。'),
        ],
        dialogue: [
          partner('Look outside! How is the weather?', '看外面！天氣怎麼樣？'),
          child("It's sunny today.", '今天是晴天。'),
          partner('Oh no, here come the clouds!', '哎呀，烏雲來了！'),
          child("It's raining.", '正在下雨。'),
          partner('Brrr! I am shivering.', '好冷！我在發抖。'),
          child("It's cold.", '很冷。'),
        ],
      }),
      teach({
        rule: 'oa 發長音 oh',
        hint: 'oa 兩個字母一起唸成「ㄡ」。',
        words: [word('coat', '🧥', ['c', 'oa', 't']), word('boat', '⛵', ['b', 'oa', 't']), word('goat', '🐐', ['g', 'oa', 't']), word('road', '🛣️', ['r', 'oa', 'd'])],
        sight: word('some', '🔢'),
        sentences: [
          sentence('Put on your coat.', '穿上你的外套。', '🧥', '天氣變冷時提醒家人。'),
          sentence('Take your umbrella.', '帶你的雨傘。', '☂️', '出門前提醒帶傘。'),
          sentence('Are you warm?', '你暖和嗎？', '🔥', '關心對方冷不冷。'),
        ],
        dialogue: [
          partner("It's cold outside.", '外面很冷。'),
          child('Put on your coat.', '穿上你的外套。'),
          partner("And it's raining!", '而且正在下雨！'),
          child('Take your umbrella.', '帶你的雨傘。'),
          partner('OK. I am ready!', '好，我準備好了！'),
          child('Are you warm?', '你暖和嗎？'),
          partner('Yes, thank you!', '是的，謝謝！'),
        ],
      }),
      review([
        partner('How is the weather today?', '今天天氣怎麼樣？'),
        child("It's sunny today.", '今天是晴天。'),
        partner('Oh, now it is windy and cold.', '哦，現在又有風又冷。'),
        child("It's cold.", '很冷。'),
        partner('What should I wear?', '我該穿什麼？'),
        child('Put on your coat.', '穿上你的外套。'),
        partner('Now look, rain!', '看，下雨了！'),
        child("It's raining.", '正在下雨。'),
        partner('What else do I need?', '我還需要什麼？'),
        child('Take your umbrella.', '帶你的雨傘。'),
        partner('Thank you. Do I look good?', '謝謝。我看起來還好嗎？'),
        child('Are you warm?', '你暖和嗎？'),
      ]),
    ],
  },
  {
    id: 'shopping',
    title: '購物與問價錢',
    scene: emojiScene('在商店裡', '#fff0d6', ['🏪', '🛒', '💰']),
    sticker: { emoji: '🛒', name: '購物貼紙' },
    days: [
      teach({
        rule: 'sh 發 shh 的音',
        hint: 's 和 h 在一起，唸成安靜的「噓」聲。',
        words: [word('ship', '🚢', ['sh', 'i', 'p']), word('shop', '🏪', ['sh', 'o', 'p']), word('fish', '🐟', ['f', 'i', 'sh']), word('shell', '🐚', ['sh', 'e', 'll'])],
        sight: word('want', '🙏'),
        sentences: [
          sentence('How much is it?', '這個多少錢？', '💰', '在商店看到東西時問價錢。'),
          sentence("It's fifty dollars.", '五十元。', '💵', '玩商店遊戲時，孩子可以當老闆。'),
          sentence("It's too expensive.", '太貴了。', '😱', '覺得價格太高時說。'),
        ],
        dialogue: [
          partner('Welcome to my shop! Do you want this hat?', '歡迎來到我的店！你想要這頂帽子嗎？'),
          child('How much is it?', '這個多少錢？'),
          partner("It's thirty dollars.", '三十元。'),
          child("It's too expensive.", '太貴了。'),
          partner('Now you are the shopkeeper. How much is this ball?', '現在換你當老闆。這顆球多少錢？'),
          child("It's fifty dollars.", '五十元。'),
        ],
      }),
      teach({
        rule: 'ch 發 chuh 的音',
        hint: 'c 和 h 在一起，唸成「ㄑ」的音，像火車 choo-choo。',
        words: [word('chip', '🍟', ['ch', 'i', 'p']), word('chin', '😛', ['ch', 'i', 'n']), word('chick', '🐥', ['ch', 'i', 'ck']), word('lunch', '🍱', ['l', 'u', 'n', 'ch'])],
        sight: word('here', '👇'),
        sentences: [
          sentence("I'll take it.", '我要買這個。', '👍', '決定要買時說。'),
          sentence("Here's the money.", '這是錢。', '💵', '付錢時說。'),
          sentence('Can I have a bag?', '我可以要一個袋子嗎？', '🛍️', '結帳時需要袋子時說。'),
        ],
        dialogue: [
          partner('Do you like the toy?', '你喜歡這個玩具嗎？'),
          child("I'll take it.", '我要買這個。'),
          partner('Great! Please pay.', '太好了！請付錢。'),
          child("Here's the money.", '這是錢。'),
          partner('Thank you!', '謝謝！'),
          child('Can I have a bag?', '我可以要一個袋子嗎？'),
          partner('Sure!', '好的！'),
        ],
      }),
      review([
        partner('Welcome to my shop!', '歡迎來到我的店！'),
        child('How much is it?', '這個多少錢？'),
        partner("It's fifty dollars.", '五十元。'),
        child("It's too expensive.", '太貴了。'),
        partner('How about this one? Thirty dollars.', '那這個呢？三十元。'),
        child("I'll take it.", '我要買這個。'),
        partner('Please pay.', '請付錢。'),
        child("Here's the money.", '這是錢。'),
        partner('Thank you!', '謝謝！'),
        child('Can I have a bag?', '我可以要一個袋子嗎？'),
      ]),
    ],
  },
  {
    id: 'help',
    title: '身體不舒服與求助',
    scene: emojiScene('身體不舒服', '#ffe6e6', ['🤒', '🩹', '👩‍⚕️']),
    sticker: { emoji: '🩹', name: '求助貼紙' },
    days: [
      teach({
        rule: 'ee 發長音 ee',
        hint: 'ee 兩個 e 一起唸成「一」的長音。',
        words: [word('bee', '🐝', ['b', 'ee']), word('tree', '🌳', ['t', 'r', 'ee']), word('feet', '🦶', ['f', 'ee', 't']), word('knee', '🦵', ['kn', 'ee'])],
        sight: word('one', '1️⃣'),
        sentences: [
          sentence("I don't feel well.", '我覺得不舒服。', '🤒', '孩子不舒服時，鼓勵他開口告訴大人。'),
          sentence('I have a headache.', '我頭痛。', '🤕', '說明哪裡不舒服。'),
          sentence('My tummy hurts.', '我肚子痛。', '🤢', '說明哪裡不舒服。'),
        ],
        dialogue: [
          partner('You look pale. Are you OK?', '你臉色蒼白。你還好嗎？'),
          child("I don't feel well.", '我覺得不舒服。'),
          partner("Oh no! What's wrong?", '糟糕！哪裡不舒服？'),
          child('I have a headache.', '我頭痛。'),
          partner('Anything else?', '還有嗎？'),
          child('My tummy hurts.', '我肚子痛。'),
          partner("Let's tell the teacher.", '我們去告訴老師。'),
        ],
      }),
      teach({
        rule: 'th 發 thh 的音',
        hint: '舌頭輕輕放在上下牙齒中間吹氣，就是 th 的音。',
        words: [word('this', '👉', ['th', 'i', 's']), word('that', '👈', ['th', 'a', 't']), word('bath', '🛁', ['b', 'a', 'th']), word('three', '3️⃣', ['th', 'r', 'ee'])],
        sight: word('two', '2️⃣'),
        sentences: [
          sentence('I have a fever.', '我發燒了。', '🌡️', '發燒時告訴大人。'),
          sentence('I need to see a doctor.', '我需要看醫生。', '👩‍⚕️', '需要看醫生時說。'),
          sentence('Please help me!', '請幫幫我！', '🆘', '遇到困難時大聲求助。'),
        ],
        dialogue: [
          partner('Your face is red. Are you OK?', '你的臉好紅。你還好嗎？'),
          child('I have a fever.', '我發燒了。'),
          partner('What should we do?', '我們該怎麼辦？'),
          child('I need to see a doctor.', '我需要看醫生。'),
          partner('Who can help?', '誰可以幫忙？'),
          child('Please help me!', '請幫幫我！'),
        ],
      }),
      teach({
        ...magicE('o'),
        words: [word('home', '🏠'), word('nose', '👃'), word('bone', '🦴'), word('rose', '🌹')],
        sight: word('with', '🤝'),
        sentences: [
          sentence('Call my mom, please.', '請打電話給我媽媽。', '📞', '在學校或外面需要聯絡家人時說。'),
          sentence("I'm okay now.", '我現在好多了。', '😊', '身體好一點後說。'),
          sentence('Thank you for helping me.', '謝謝你幫我。', '🙏', '得到幫助後道謝。'),
        ],
        dialogue: [
          partner('The nurse is here.', '護理師來了。'),
          child('Call my mom, please.', '請打電話給我媽媽。'),
          partner('OK, I am calling her now.', '好，我現在打給她。'),
          child("I'm okay now.", '我現在好多了。'),
          partner('Great! Say thank you.', '太好了！說聲謝謝。'),
          child('Thank you for helping me.', '謝謝你幫我。'),
        ],
      }),
      review([
        partner('You look pale. Are you OK?', '你臉色蒼白，你還好嗎？'),
        child("I don't feel well.", '我覺得不舒服。'),
        partner('Where does it hurt?', '哪裡痛？'),
        child('I have a headache.', '我頭痛。'),
        partner('Anything else?', '還有嗎？'),
        child('My tummy hurts.', '我肚子痛。'),
        partner('You feel hot. What do you need?', '你摸起來很燙。你需要什麼？'),
        child('I need to see a doctor.', '我需要看醫生。'),
        partner('I am scared. What can I do?', '我好怕。我能做什麼？'),
        child('Please help me!', '請幫幫我！'),
        partner('Who should we call?', '我們該聯絡誰？'),
        child('Call my mom, please.', '請打電話給我媽媽。'),
        partner('You look better now.', '你看起來好一點了。'),
        child("I'm okay now.", '我現在好多了。'),
        partner('The doctor helped you.', '醫生幫了你。'),
        child('Thank you for helping me.', '謝謝你幫我。'),
      ]),
    ],
  },
  {
    id: 'bedtime',
    title: '睡前與道晚安、回顧',
    scene: emojiScene('晚上睡覺前', '#cbd5ff', ['🌙', '🛏️', '⭐']),
    sticker: { emoji: '🌙', name: '晚安貼紙' },
    days: [
      teach({
        rule: 'oo 發長音 oo',
        hint: 'oo 兩個 o 一起唸成「ㄨ」的長音。',
        words: [word('moon', '🌙', ['m', 'oo', 'n']), word('food', '🍱', ['f', 'oo', 'd']), word('zoo', '🦁', ['z', 'oo']), word('room', '🛋️', ['r', 'oo', 'm'])],
        sight: word('there', '📍'),
        sentences: [
          sentence("I'm sleepy.", '我想睡覺了。', '😴', '睡前用英文說。'),
          sentence('Time for bed.', '該上床睡覺了。', '🛏️', '睡前提醒彼此。'),
          sentence('Brush your teeth.', '去刷牙。', '🪥', '睡前提醒刷牙。'),
        ],
        dialogue: [
          partner("It's late. Look at the moon.", '很晚了。看月亮。'),
          child("I'm sleepy.", '我想睡覺了。'),
          partner('Me too. What now?', '我也是。現在要做什麼？'),
          child('Time for bed.', '該上床睡覺了。'),
          partner('What do we do first?', '我們先做什麼？'),
          child('Brush your teeth.', '去刷牙。'),
        ],
      }),
      teach({
        rule: 'ck 發 kuh 的音',
        hint: 'c 和 k 在一起，只唸成一個「ㄎ」的音，常在字尾。',
        words: [word('duck', '🦆', ['d', 'u', 'ck']), word('sock', '🧦', ['s', 'o', 'ck']), word('clock', '🕐', ['c', 'l', 'o', 'ck']), word('back', '🔙', ['b', 'a', 'ck'])],
        sight: word('friend', '🧑‍🤝‍🧑'),
        sentences: [
          sentence('Good night!', '晚安！', '🌙', '睡前互道晚安。'),
          sentence('Sweet dreams.', '祝你有個好夢。', '💤', '睡前對家人說。'),
          sentence('See you tomorrow.', '明天見。', '👋', '睡前或放學時說。'),
        ],
        dialogue: [
          partner('I am in bed now.', '我已經在床上了。'),
          child('Good night!', '晚安！'),
          partner('Good night!', '晚安！'),
          child('Sweet dreams.', '祝你有個好夢。'),
          partner('Thank you. Bye!', '謝謝。掰掰！'),
          child('See you tomorrow.', '明天見。'),
        ],
      }),
      review([
        partner("Let's go through a whole day! Morning first.", '我們來走一遍一整天！先從早上開始。'),
        child('Good morning!', '早安！'),
        partner('What do we do before breakfast?', '早餐前我們要做什麼？'),
        child('I brush my teeth.', '我刷牙。'),
        partner('What about breakfast?', '早餐呢？'),
        child('What do you want for breakfast?', '你早餐想吃什麼？'),
        partner('Time to leave!', '要出門了！'),
        child("Let's go to school.", '我們去上學吧。'),
        partner('I forgot my pencil.', '我忘了帶鉛筆。'),
        child('Can I borrow your pencil?', '我可以借你的鉛筆嗎？'),
        partner('Now it is lunch time.', '現在是午餐時間。'),
        child("I'm hungry.", '我餓了。'),
        partner('After lunch, it is recess.', '午餐後是下課時間。'),
        child("Let's play!", '我們來玩吧！'),
        partner('Do you want some apples?', '你想吃蘋果嗎？'),
        child('Do you like apples?', '你喜歡蘋果嗎？'),
        partner('Look outside!', '看外面！'),
        child("It's raining.", '正在下雨。'),
        partner('The day is over. Good night!', '一天結束了。晚安！'),
        child('Good night!', '晚安！'),
      ], 'course'),
    ],
  },
];

// --- flatten into numbered days ----------------------------------------------
const MIA = { name: 'Mia', picture: '🧒' };

export const DAYS = [];
export const UNITS = [];

for (const unit of UNIT_DEFS) {
  const numbers = [];
  for (const lesson of unit.days) {
    const day = DAYS.length + 1;
    numbers.push(day);
    const base = { day, unit: unit.title, unitId: unit.id, scene: unit.scene };
    if (lesson.type === 'review') {
      DAYS.push({ ...base, review: true, reviewScope: lesson.scope, dialogue: { partner: MIA, lines: lesson.dialogue } });
    } else {
      const { dialogue, words, sight, rule, hint, sounds, sentences } = lesson;
      DAYS.push({
        ...base,
        sentences,
        phonics: { rule, hint, sounds, words, sight },
        dialogue: { partner: MIA, lines: dialogue },
      });
    }
  }
  UNITS.push({ id: unit.id, title: unit.title, days: numbers, sticker: { id: unit.id, ...unit.sticker } });
}

// Words and sentences a day covers; a review day covers its unit, or the whole course for the last day.
export function dayContent(day) {
  let days = [day];
  if (day.review) {
    const inScope = day.reviewScope === 'course' ? () => true : (d) => d.unitId === day.unitId;
    days = DAYS.filter((d) => !d.review && inScope(d));
  }
  return {
    words: days.flatMap((d) => [...d.phonics.words, d.phonics.sight].map((w) => w.text)),
    sentences: days.flatMap((d) => d.sentences.map((s) => s.text)),
  };
}

const MSG_CONFIRM_OPEN_MISSION = 'ミッションは話し手には秘密です。\n画面共有を切ったり、確認時に画面を見られないようにコッソリ確認してください。\n'

/*
 * ロード処理
 */
window.onload = () => {
  getMission();
  setTalkTheme();
  setEmotion();
  setBounceCards();
}

/**
 * ミッション取得
 */
 const getMission = () => {
  const missionText = document.getElementById('mission-text');
  let missions = window.MISSIONS.slice();

  let missionList = Object.values(missions).filter(x => x.value !== missionText.innerText)

  const index = Math.floor(Math.random() * missionList.length);
  missionText.innerText = missionList[index].value;
}

/**
 * トークテーマ初期化処理
 */
const setTalkTheme = () => {
  const themes = window.THEMES.slice();
  // カテゴリー別にテーマカードをセット
  Object.values(themes).forEach(theme => {
    const themeTab = document.getElementById(theme.category);
    const html = `<button type="button" class="theme-card js-theme-card" data-category="${theme.category}" onclick="selectTalkThemeElement(event, 'js-theme-card')">${theme.value}</button>`;
    const themeElement = html;
    themeTab.insertAdjacentHTML('beforeend', themeElement);
  })

  // テーマタブのデフォルト値をセット
  const defaultThemeTab = document.querySelector('.js-theme-card-list');
  defaultThemeTab.classList.add('active');
  // テーマのデフォルト値をセット
  const defaultTalkTheme = document.querySelector('.js-theme-card');
  defaultTalkTheme.classList.add('active');
}

/**
 * 感情初期化処理
 */
const setEmotion = () => {
  console.log(window.EMOTIONS);
  const emotions = window.EMOTIONS.slice();

  const emotionList = document.getElementById('emotion-list');
    // カテゴリー別にテーマカードをセット
    Object.values(emotions).forEach(emotion => {
      const html = `<button type="button" class="emotion js-emotion" onclick="selectTalkThemeElement(event, 'js-emotion')">${emotion.value}</button>`;
      const themeElement = html;
      emotionList.insertAdjacentHTML('beforeend', themeElement);
    })
    // デフォルト値をセット
    const defaultEmotion = document.querySelector('.js-emotion');
    defaultEmotion.classList.add('active');
}

/**
 * バウンスカードセット
 */
 const setBounceCards = () => {
  let bounces = window.BOUNCES.slice();
  const bounceCards = document.querySelectorAll('.js-bounce-card-body');

  bounceCards.forEach(card => {
    const index = Math.floor(Math.random() * bounces.length);
    card.innerText = bounces[index].value;
    bounces.splice(index, 1);
  })
}

// 次フェーズ表示ボタン・リンククリックイベント
const moveToNextPhase = (e) => {
  // 各フェーズ遷移時のチェック
  switch (e.target.dataset.next) {
    case 'phase2':
      // ミッション未確定の場合、遷移しない
      const mission = document.getElementById('reminder-mission');
      if (!mission.innerText) {
        alert('次へ進む前にミッションを確認してください。');
        return;
      }
      break;

    case 'phase3':
      // phase3遷移時にモーダルを非表示にする
      toggleModal('direction-modal');
      break;

    case 'phase4':
      // リマインダーを非表示にする
      const reminderWrapper = document.getElementById('reminder-wrapper');
      reminderWrapper.classList.add('hidden');
      break;

    default:
      break;
  }

  const currentSection = document.getElementById(e.target.dataset.current);
  currentSection.classList.add('hidden');
  const nextSection = document.getElementById(e.target.dataset.next);
  nextSection.classList.remove('hidden');
}

/**
 * モーダル表示/非表示イベント
 * @param {string} targetModalId : 対象モーダルID
 */
 const toggleModal = (targetModalId) => {
  const modalArea = document.getElementById(targetModalId);
  modalArea.classList.toggle('show');
}

/**
 * ミッションモーダル表示
 */
const showMissionModal = () => {  
  // 確定済みの場合、モーダル表示はしない
  const lookBackMission = document.getElementById('look-back-mission');
  if(lookBackMission.innerText !== '') {
    alert('ミッションは確定しています。\n次へ進みましょう。');
    return;
  }

  if (confirm(MSG_CONFIRM_OPEN_MISSION)) {
    toggleModal('mission-modal');
  }
}

/**
 * ミッション確定
 */
const decideMission = () => {
  const mission = document.getElementById('mission-text');
  // リマインダーにセット
  const reminderMission = document.getElementById('reminder-mission');
  reminderMission.innerText = mission.innerText;
  // Phase4 ミッションカードにセット
  const lookBackMission = document.getElementById('look-back-mission');
  lookBackMission.innerText = mission.innerText;

  toggleModal('mission-modal');
}

/**
 * トークカテゴリー選択処理
 * @param {Event} e
 */
const selectThemeTab = (e) => {
  if (e.target.classList.contains('active')) {
    return;
  }

  // タブの活性/非活性処理
  const emotions = document.querySelectorAll('.js-tab');
  emotions.forEach(ele => {
    ele.classList.remove('active');
  });
  e.target.classList.add('active');

  // 対応するテーマカードリストのアクティブ/非アクティブ処理
  const cardList = document.querySelectorAll('.js-theme-card-list');
  cardList.forEach(ele => {
    ele.classList.remove('active');
  });
  const targetCardList = document.getElementById(e.target.dataset.category);
  targetCardList.classList.add('active');
}

/**
 * トークテーマ選択イベント
 * @param {Event} e
 * @param {string} 対象クラス名
 */
const selectTalkThemeElement = (e, targetClass) => {
  if (e.target.classList.contains('active')) {
    return;
  }

  const emotions = document.querySelectorAll(`.${targetClass}`);
  emotions.forEach(ele => {
    ele.classList.remove('active');
  });
  e.target.classList.add('active');
}

/**
 * トークスタート押下時処理
 */
 const startTalk = () => {
  // リマインダーにセット
  const selectedTheme = document.querySelector('.js-theme-card.active');
  let category = '';
  switch (selectedTheme.dataset.category) {
    case 'private':
      category = 'プライベート';
      break;

    case 'work':
      category = '仕事';
      break;

    case 'company':
      category = '会社';
      break;

    default:
      break;
  }

  // リマインダーにセット
    const reminderThemeCategory = document.getElementById('reminder-theme-category');
    const reminderThemeItem = document.getElementById('reminder-theme-item');
    reminderThemeCategory.innerText = category;
    reminderThemeItem.innerText = selectedTheme.innerText;

    const selectedEmotion = document.querySelector('.js-emotion.active');
    const reminderEmotion = document.getElementById('reminder-emotion');
    reminderEmotion.innerText = selectedEmotion.innerText;

    // リマインダー表示
    const reminderWrapper = document.getElementById('reminder-wrapper');
    reminderWrapper.classList.remove('hidden');
    toggleModal('direction-modal');
}

/**
 * リマインダー表示/非表示処理
 */
const toggleReminder = (e) => {
  const reminder = document.getElementById('reminder');
  reminder.classList.toggle('hidden');

  // 非表示時、ミッションカードを非表示にする
  if (reminder.classList.contains('hidden')) {
    const missionCard = reminder.querySelector('.js-mission-card');
    missionCard.classList.add('reverse');
  }
}

/**
 * リマインダーのミッションカード表示/非表示処理
 * @param {Event} e 
 */
const toggleMissionCardOnReminder = (e) => {
  const isOpened = !e.target.classList.contains('reverse') && !e.target.parentNode.classList.contains('reverse');
  if (isOpened) {
    const card = e.target.closest('.js-mission-card');
    card.classList.add('reverse');
  } else {
    if (confirm(MSG_CONFIRM_OPEN_MISSION)) {
      openCard(e);    
    }
  }
}

/**
 * カード表示処理
 * @param {Event} e
 */
const openCard = (e) => {
  e.target.classList.remove('reverse');
  e.target.parentNode.classList.remove('reverse');
}

/**
 * エピローグテーマ表示処理
 * @param {Event} e
 */
const openEpilogueTheme = (e) => {
  const epilogue = document.getElementById('epilogue-theme');
  let epilogues = window.EPILOGUES.slice();

  const index = Math.floor(Math.random() * epilogues.length);
  epilogue.innerText = epilogues[index].value;

  e.target.disabled = true;
}

/**
 * リロード
 */
const reload = () => {
  window.location.reload(true);
}
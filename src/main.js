const saveKey = "cat-cash-clicker:v2";
const multiplierMaxLevel = 30;
const firstRebirthCost = 100000000000;
const freePriceMode = false;
const oneDayMs = 86400000;

const state = {
  money: 0,
  multiplier: 1,
  multiplierLevel: 0,
  rebirths: 0,
  clicks: 0,
  tunaCans: 0,
  exchangedTunaClicks: 0,
  luckyBells: 0,
  kittiGoods: 0,
  bossActive: false,
  bossHp: 0,
  bossMaxHp: 0,
  bossesDefeated: 0,
  lastWheelSpin: 0,
  cityJobsClaimed: [],
  hasSadboiFusion: false,
  prestigeClickBoost: 1,
  tunaExchangeBonus: 0,
  bossBountyLevel: 0,
  catnipEnergy: 0,
  catnipEndsAt: 0,
  chestsReady: 0,
  chestsOpened: 0,
  bankLevel: 0,
  bankCost: 1000000,
  scratchCost: 50000,
  tunaMagnetLevel: 0,
  tunaMagnetCost: 20,
  jackpotClicks: 0,
  comboStreak: 0,
  lastClickAt: 0,
  slotCost: 75000,
  postcards: 0,
  postcardCost: 150000,
  weather: "Sunny",
  weatherEndsAt: 0,
  weatherCost: 100000,
  lastNapAt: 0,
  panicCost: 10,
  claimedAchievements: [],
  boostEndsAt: 0,
  achievementBoostEndsAt: 0,
  hasPremiumCat: false,
  hasGoldenCat: false,
  hasEmoCat: false,
  hasWarCat: false,
  hasLarryCat: false,
  hasWettyCat: false,
  hasGlungusCat: false,
  hasGlorbzorgCat: false,
  hasSoggyCat: false,
  larryMultiplierApplied: 100,
  glorbzorgMultiplierApplied: 50,
  equippedCat: "normal",
  multiplierCost: 25,
  treatCost: 120,
  catUpgradeCost: 10000,
  goldenCatCost: 500000,
  emoCatCost: 500000,
  warCatCost: 100000000,
  larryCatCost: 3000,
  wettyCatCost: 1500,
  glungusCatCost: 10000000000,
  glorbzorgCatCost: 1000000000000,
  soggyCatCost: 5000000000000,
};

const eggDrops = [
  { name: "Pocket Tuna", rarity: "Common", chance: 45, moneyClicks: 40, tuna: 2, multiplier: 1 },
  { name: "Lucky Whisker", rarity: "Rare", chance: 28, moneyClicks: 120, tuna: 5, multiplier: 1 },
  { name: "Cursed Collar", rarity: "Epic", chance: 18, moneyClicks: 300, tuna: 10, multiplier: 1.05 },
  { name: "Legendary Kitten Spark", rarity: "Legendary", chance: 9, moneyClicks: 800, tuna: 20, multiplier: 1.15 },
];

const cityJobs = [
  { id: "click-500", label: "Click 500 cats", isDone: () => state.clicks >= 500, reward: () => {
    state.tunaCans += 25;
    return "25 tuna";
  } },
  { id: "boss-1", label: "Beat 1 Boss Cat", isDone: () => state.bossesDefeated >= 1, reward: () => {
    state.money += getPerClick() * 500;
    return `${formatMoney(getPerClick() * 500)}`;
  } },
  { id: "rebirth-1", label: "Do 1 rebirth", isDone: () => state.rebirths >= 1, reward: () => {
    state.kittiGoods += 2;
    return "2 Kitti Goods";
  } },
];

const playerTitles = [
  { clicks: 0, title: "Sleepy Kitten" },
  { clicks: 100, title: "Tiny Tapper" },
  { clicks: 1000, title: "Certified Kitti Kliker" },
  { clicks: 10000, title: "Tuna Baron" },
  { clicks: 100000, title: "Clickstorm Legend" },
  { clicks: 1000000, title: "Kitti Overlord" },
];

const scratchPrizes = [
  { label: "cash pile", action: () => {
    const payout = getPerClick() * 350;
    state.money += payout;
    return formatMoney(payout);
  } },
  { label: "tuna stash", action: () => {
    const tuna = hasRebirthUnlocks() ? 20 + state.tunaMagnetLevel : 0;
    state.tunaCans += tuna;
    return tuna > 0 ? `${tuna} tuna` : "rebirth first for tuna";
  } },
  { label: "catnip burst", action: () => {
    state.catnipEndsAt = Math.max(state.catnipEndsAt, Date.now()) + 10000;
    return "10s catnip fever";
  } },
  { label: "mystery chest", action: () => {
    state.chestsReady += 1;
    return "1 chest";
  } },
  { label: "tiny permanent multi", action: () => {
    state.multiplier *= 1.04;
    return "permanent x1.04";
  } },
];

const weatherEvents = [
  { name: "Sunny", boost: 1, note: "normal clicking" },
  { name: "Tuna Rain", boost: 1.25, note: "+25% clicks" },
  { name: "Zoomies Wind", boost: 1.5, note: "+50% clicks" },
  { name: "Sleepy Fog", boost: 0.8, note: "sleepy but still funny" },
  { name: "Golden Clouds", boost: 2, note: "double clicks" },
];

const catThemes = {
  normal: {
    title: "Local Forecast - Elevator",
    src: "assets/local-forecast-elevator.mp3",
  },
  premium: {
    title: "OIIA OIIA",
    src: "assets/oiia-oiia.mp3",
  },
  golden: {
    title: "Ay mi Gatito Miau Miau",
    src: "assets/golden-theme.mp3",
  },
  emo: {
    title: "Ai Dua Em Ve",
    src: "assets/emo-y2k-theme.mp3",
  },
  war: {
    title: "Your Best Nightmare",
    src: "assets/your-best-nightmare.mp3",
  },
  larry: {
    title: "Rip and Tear",
    src: "assets/rip-and-tear.mp3",
  },
  wetty: {
    title: "Battle Against A True Hero",
    src: "assets/wetty-theme.mp3",
  },
  glungus: {
    title: "Final Battle",
    src: "assets/final-battle.mp3",
  },
  glorbzorg: {
    title: "No theme",
    src: "",
  },
  soggy: {
    title: "Dion Timmer - TIDAL WAVE",
    src: "assets/soggy-theme.mp3",
  },
  boss: {
    title: "Apoplexy Tanks Cover",
    src: "assets/boss-theme.mp3",
  },
};

const clickAchievements = [
  { clicks: 1, title: "getting started" },
  { clicks: 100, title: "i mean ur still a noob" },
  { clicks: 200, title: "getting better" },
  { clicks: 500, title: "ok wettys getting closer" },
  { clicks: 750, title: "even closer" },
  { clicks: 900, title: "WOW only a bit left" },
  { clicks: 1000, title: "WETTYYYYYY" },
];

const citiShops = {
  normal: {
    title: "Normal Cat Shop",
    image: "assets/normal-cat.jpg",
    description: "The starter booth for classic clicking supplies.",
    items: [
      { name: "Starter Yarn", cost: 1 },
      { name: "Window Seat", cost: 2 },
      { name: "Regular Cat Poster", cost: 3 },
    ],
  },
  premium: {
    title: "Premium Cat Shop",
    image: "assets/premium-cat.jpg",
    description: "Fancy goods for the sturdy premium icon.",
    items: [
      { name: "Premium Bowl", cost: 2 },
      { name: "Soft Blanket", cost: 3 },
      { name: "Fancy Collar", cost: 5 },
    ],
  },
  golden: {
    title: "Golden Cat Shop",
    image: "assets/golden-cat.webp",
    description: "Shiny stuff from the tiny golden emperor.",
    items: [
      { name: "Gold Tuna", cost: 4 },
      { name: "Mini Crown", cost: 6 },
      { name: "Lucky Coin", cost: 8 },
    ],
  },
  emo: {
    title: "Emo Y2K Shop",
    image: "assets/emo-cat.jpg",
    description: "Dramatic drip and 2000s sadness supplies.",
    items: [
      { name: "Pink Energy Can", cost: 3 },
      { name: "Black Hair Dye", cost: 5 },
      { name: "Broken Heart Charm", cost: 7 },
    ],
  },
  war: {
    title: "War Cat Shop",
    image: "assets/war-cat.jpg",
    description: "Helmet-grade booth inventory.",
    items: [
      { name: "Cardboard Tank", cost: 6 },
      { name: "Tiny Helmet", cost: 8 },
      { name: "Battle Snack", cost: 10 },
    ],
  },
  wetty: {
    title: "Wetty Shop",
    image: "assets/wetty.jpg",
    description: "Drippy gear from the wettest merchant.",
    items: [
      { name: "Sink Water", cost: 3 },
      { name: "Wet Towel", cost: 5 },
      { name: "Battle Hero CD", cost: 7 },
    ],
  },
  soggy: {
    title: "Soggy Shop",
    image: "assets/soggy.png",
    description: "Ultra rare bath-time artifacts.",
    items: [
      { name: "Rubber Duck", cost: 8 },
      { name: "Bubble Soap", cost: 10 },
      { name: "Soggy Badge", cost: 12 },
    ],
  },
  larry: {
    title: "Evil Larry Shop",
    image: "https://i.kym-cdn.com/photos/images/newsfeed/003/015/906/9ed.png",
    description: "A myth. A legend. A concerning store owner.",
    items: [
      { name: "Doom Yarn", cost: 8 },
      { name: "Larry Idol", cost: 12 },
      { name: "Forbidden Treat", cost: 15 },
    ],
  },
  glungus: {
    title: "Glungus Shop",
    image:
      "https://preview.redd.it/where-did-glungus-originate-from-v0-v88zmc7c16uf1.jpeg?auto=webp&s=6e1c8d36adaa443c832cbd4ae5e2341d43329ee0",
    description: "Impossible items from the impossible cat.",
    items: [
      { name: "Glungus Pebble", cost: 9 },
      { name: "Adventure Map", cost: 12 },
      { name: "Legendary Coupon", cost: 16 },
    ],
  },
  glorbzorg: {
    title: "Glorbzorg Shop",
    image: "https://media1.tenor.com/m/JhocXY2TYZgAAAAd/alien-meme-cat-funny-cat.gif",
    description: "Alien goods from a krash landing on earf.",
    items: [
      { name: "Space Tuna", cost: 10 },
      { name: "Green Goo", cost: 14 },
      { name: "Tiny UFO", cost: 18 },
    ],
  },
};

const els = {
  money: document.querySelector("#money"),
  perClick: document.querySelector("#perClick"),
  multiplier: document.querySelector("#multiplier"),
  tunaCans: document.querySelector("#tunaCans"),
  rebirths: document.querySelector("#rebirths"),
  playerTitle: document.querySelector("#playerTitle"),
  catnipMeter: document.querySelector("#catnipMeter"),
  catnipBar: document.querySelector("#catnipBar"),
  catnipStatus: document.querySelector("#catnipStatus"),
  chestButton: document.querySelector("#chestButton"),
  chestStatus: document.querySelector("#chestStatus"),
  comboRush: document.querySelector("#comboRush"),
  jackpotMeter: document.querySelector("#jackpotMeter"),
  bankButton: document.querySelector("#bankButton"),
  bankStatus: document.querySelector("#bankStatus"),
  scratchButton: document.querySelector("#scratchButton"),
  scratchStatus: document.querySelector("#scratchStatus"),
  tunaMagnetButton: document.querySelector("#tunaMagnetButton"),
  tunaMagnetStatus: document.querySelector("#tunaMagnetStatus"),
  slotButton: document.querySelector("#slotButton"),
  slotStatus: document.querySelector("#slotStatus"),
  postcardButton: document.querySelector("#postcardButton"),
  postcardStatus: document.querySelector("#postcardStatus"),
  weatherButton: document.querySelector("#weatherButton"),
  weatherStatus: document.querySelector("#weatherStatus"),
  napButton: document.querySelector("#napButton"),
  napStatus: document.querySelector("#napStatus"),
  panicButton: document.querySelector("#panicButton"),
  panicStatus: document.querySelector("#panicStatus"),
  clicks: document.querySelector("#clicks"),
  achievementCount: document.querySelector("#achievementCount"),
  achievementList: document.querySelector("#achievementList"),
  achievementPopup: document.querySelector("#achievementPopup"),
  bossPanel: document.querySelector("#bossPanel"),
  bossName: document.querySelector("#bossName"),
  bossHp: document.querySelector("#bossHp"),
  bossBar: document.querySelector("#bossBar"),
  bossButton: document.querySelector("#bossButton"),
  bossReward: document.querySelector("#bossReward"),
  stageBossHealth: document.querySelector("#stageBossHealth"),
  stageBossName: document.querySelector("#stageBossName"),
  stageBossHp: document.querySelector("#stageBossHp"),
  stageBossBar: document.querySelector("#stageBossBar"),
  eggButton: document.querySelector("#eggButton"),
  eggResult: document.querySelector("#eggResult"),
  wheelButton: document.querySelector("#wheelButton"),
  wheelStatus: document.querySelector("#wheelStatus"),
  cityJobsList: document.querySelector("#cityJobsList"),
  fusionButton: document.querySelector("#fusionButton"),
  fusionStatus: document.querySelector("#fusionStatus"),
  kittiGoods: document.querySelector("#kittiGoods"),
  prestigeClickButton: document.querySelector("#prestigeClickButton"),
  prestigeTunaButton: document.querySelector("#prestigeTunaButton"),
  prestigeBossButton: document.querySelector("#prestigeBossButton"),
  boostTimer: document.querySelector("#boostTimer"),
  rebirthBoost: document.querySelector("#rebirthBoost"),
  combo: document.querySelector("#combo"),
  easterCat: document.querySelector("#easterCat"),
  musicPlayer: document.querySelector("#musicPlayer"),
  musicToggle: document.querySelector("#musicToggle"),
  exchangeTunaButton: document.querySelector("#exchangeTunaButton"),
  exchangeBubble: document.querySelector("#exchangeBubble"),
  enterShopButton: document.querySelector("#enterShopButton"),
  rebirthButton: document.querySelector("#rebirthButton"),
  closeShopButton: document.querySelector("#closeShopButton"),
  shopScreen: document.querySelector("#shopScreen"),
  citiScreen: document.querySelector("#citiScreen"),
  citiGrid: document.querySelector("#citiGrid"),
  citiPlayer: document.querySelector("#citiPlayer"),
  citiShopPanel: document.querySelector("#citiShopPanel"),
  citiShopClose: document.querySelector("#citiShopClose"),
  citiShopImage: document.querySelector("#citiShopImage"),
  citiShopTitle: document.querySelector("#citiShopTitle"),
  citiShopDescription: document.querySelector("#citiShopDescription"),
  citiShopItems: document.querySelector("#citiShopItems"),
  clickerTab: document.querySelector("#clickerTab"),
  kittiCitiTab: document.querySelector("#kittiCitiTab"),
  citiBackButton: document.querySelector("#citiBackButton"),
  yarnButton: document.querySelector("#yarnButton"),
  fishButton: document.querySelector("#fishButton"),
  bellButton: document.querySelector("#bellButton"),
  couponButton: document.querySelector("#couponButton"),
  yarnCost: document.querySelector("#yarnCost"),
  fishCost: document.querySelector("#fishCost"),
  bellCost: document.querySelector("#bellCost"),
  couponCost: document.querySelector("#couponCost"),
  larryShopButton: document.querySelector("#larryShopButton"),
  wettyShopButton: document.querySelector("#wettyShopButton"),
  catButton: document.querySelector("#catButton"),
  multiplierButton: document.querySelector("#multiplierButton"),
  treatButton: document.querySelector("#treatButton"),
  catUpgradeButton: document.querySelector("#catUpgradeButton"),
  goldenCatButton: document.querySelector("#goldenCatButton"),
  emoCatButton: document.querySelector("#emoCatButton"),
  warCatButton: document.querySelector("#warCatButton"),
  larryCatButton: document.querySelector("#larryCatButton"),
  wettyCatButton: document.querySelector("#wettyCatButton"),
  glungusCatButton: document.querySelector("#glungusCatButton"),
  glorbzorgCatButton: document.querySelector("#glorbzorgCatButton"),
  soggyCatButton: document.querySelector("#soggyCatButton"),
  multiplierCost: document.querySelector("#multiplierCost"),
  treatCost: document.querySelector("#treatCost"),
  catUpgradeCost: document.querySelector("#catUpgradeCost"),
  goldenCatCost: document.querySelector("#goldenCatCost"),
  emoCatCost: document.querySelector("#emoCatCost"),
  warCatCost: document.querySelector("#warCatCost"),
  larryCatCost: document.querySelector("#larryCatCost"),
  larryShopCost: document.querySelector("#larryShopCost"),
  wettyCatCost: document.querySelector("#wettyCatCost"),
  wettyShopCost: document.querySelector("#wettyShopCost"),
  glungusCatCost: document.querySelector("#glungusCatCost"),
  glorbzorgCatCost: document.querySelector("#glorbzorgCatCost"),
  soggyCatCost: document.querySelector("#soggyCatCost"),
  rebirthCost: document.querySelector("#rebirthCost"),
  resetButton: document.querySelector("#resetButton"),
};

let isMusicPlaying = false;
let currentThemeCat = "";
let missingThemeSrc = "";
let achievementRenderKey = "";
const citiPlayerPosition = { x: 80, y: 80 };

function getActiveMusicCat() {
  return state.bossActive ? "boss" : state.equippedCat;
}

function getTheme(cat = state.equippedCat) {
  return catThemes[cat] || catThemes.normal;
}

function updateMusicButton() {
  const theme = getTheme(getActiveMusicCat());

  if (!theme.src) {
    els.musicToggle.textContent = "No Theme";
    els.musicToggle.classList.remove("playing");
    return;
  }

  if (missingThemeSrc === theme.src) {
    els.musicToggle.textContent = "Missing Theme";
    els.musicToggle.classList.remove("playing");
    return;
  }

  els.musicToggle.textContent = isMusicPlaying ? theme.title : "Music";
  els.musicToggle.classList.toggle("playing", isMusicPlaying);
}

function setMusicTheme(cat = getActiveMusicCat()) {
  const theme = getTheme(cat);
  currentThemeCat = cat;
  isMusicPlaying = false;
  els.musicPlayer.pause();
  els.musicPlayer.currentTime = 0;

  if (!theme.src) {
    els.musicPlayer.removeAttribute("src");
    missingThemeSrc = "";
    els.musicPlayer.load();
    updateMusicButton();
    return false;
  }

  els.musicPlayer.src = theme.src;
  els.musicPlayer.load();
  updateMusicButton();
  return true;
}

async function themeFileExists(src) {
  const response = await fetch(src, { method: "HEAD", cache: "no-store" });
  return response.ok;
}

async function startBackgroundMusic(cat = getActiveMusicCat()) {
  const theme = getTheme(cat);

  if (!theme.src) {
    els.combo.textContent = `${theme.title} for this cat`;
    setMusicTheme(cat);
    els.musicToggle.textContent = "No Theme";
    return;
  }

  if (missingThemeSrc !== theme.src) {
    const exists = await themeFileExists(theme.src).catch(() => false);

    if (!exists) {
      missingThemeSrc = theme.src;
      els.combo.textContent = `Missing theme file: ${theme.src}`;
      setMusicTheme(cat);
      updateMusicButton();
      return;
    }
  }

  if (currentThemeCat !== cat || !els.musicPlayer.src.includes(theme.src)) {
    setMusicTheme(cat);
  }

  els.musicPlayer.volume = 0.35;
  els.musicPlayer.play().then(() => {
    isMusicPlaying = true;
    updateMusicButton();
  }).catch(() => {
    els.musicToggle.textContent = "Start Music";
  });
}

function toggleBackgroundMusic() {
  if (isMusicPlaying) {
    els.musicPlayer.pause();
    isMusicPlaying = false;
    els.musicToggle.textContent = "Music";
    els.musicToggle.classList.remove("playing");
    return;
  }

  startBackgroundMusic();
}

function estimateMultiplierLevelFromCost(cost) {
  let level = 0;
  let currentCost = 25;

  while (level < multiplierMaxLevel && currentCost < cost) {
    currentCost = Math.ceil(currentCost * 2.35);
    level += 1;
  }

  return level;
}

function loadGame() {
  const saved = localStorage.getItem(saveKey);

  if (!saved) {
    return;
  }

  try {
    Object.assign(state, JSON.parse(saved));
    state.catUpgradeCost = 10000;
    state.goldenCatCost = 500000;
    state.emoCatCost = 500000;
    state.warCatCost = 100000000;
    state.larryCatCost = 3000;
    state.wettyCatCost = 1500;
    state.glungusCatCost = 10000000000;
    state.glorbzorgCatCost = 1000000000000;
    state.soggyCatCost = 5000000000000;
    state.tunaCans ||= 0;
    state.exchangedTunaClicks ||= 0;
    state.luckyBells ||= 0;
    state.kittiGoods ||= 0;
    state.bossActive ||= false;
    state.bossHp ||= 0;
    state.bossMaxHp ||= 0;
    state.bossesDefeated ||= 0;
    state.lastWheelSpin ||= 0;
    state.cityJobsClaimed ||= [];
    state.hasSadboiFusion ||= false;
    state.prestigeClickBoost ||= 1;
    state.tunaExchangeBonus ||= 0;
    state.bossBountyLevel ||= 0;
    state.catnipEnergy ||= 0;
    state.catnipEndsAt ||= 0;
    state.chestsReady ||= 0;
    state.chestsOpened ||= 0;
    state.bankLevel ||= 0;
    state.bankCost ||= 1000000;
    state.scratchCost ||= 50000;
    state.tunaMagnetLevel ||= 0;
    state.tunaMagnetCost ||= 20;
    state.jackpotClicks ||= 0;
    state.comboStreak ||= 0;
    state.lastClickAt ||= 0;
    state.slotCost ||= 75000;
    state.postcards ||= 0;
    state.postcardCost ||= 150000;
    state.weather ||= "Sunny";
    state.weatherEndsAt ||= 0;
    state.weatherCost ||= 100000;
    state.lastNapAt ||= 0;
    state.panicCost ||= 10;
    state.rebirths ||= 0;
    state.multiplierLevel ??= estimateMultiplierLevelFromCost(state.multiplierCost);
    state.multiplierLevel = Math.min(state.multiplierLevel, multiplierMaxLevel);
    state.claimedAchievements ||= [];
    state.achievementBoostEndsAt ||= 0;
    if (state.hasGlorbzorgCat && state.glorbzorgMultiplierApplied !== 50) {
      state.multiplier = (state.multiplier / (state.glorbzorgMultiplierApplied || 1)) * 50;
      state.glorbzorgMultiplierApplied = 50;
      saveGame();
    }
    if (state.hasLarryCat && state.larryMultiplierApplied !== 100) {
      state.multiplier = (state.multiplier / (state.larryMultiplierApplied || 20)) * 100;
      state.larryMultiplierApplied = 100;
      saveGame();
    }
    state.equippedCat = state.equippedCat || getBestOwnedCat();
  } catch {
    localStorage.removeItem(saveKey);
  }
}

function saveGame() {
  localStorage.setItem(saveKey, JSON.stringify(state));
}

function formatMoney(value) {
  return `$${Math.floor(value).toLocaleString("en-US")}`;
}

function formatCatPrice(value) {
  return getPrice(value) === 0 ? "Free" : formatMoney(value);
}

function getPrice(value) {
  return freePriceMode ? 0 : value;
}

function formatClickPrice(value) {
  return getPrice(value) === 0 ? "Free" : `${value.toLocaleString("en-US")} clicks`;
}

function formatTunaPrice(value) {
  return getPrice(value) === 0 ? "Free" : `${value.toLocaleString("en-US")} tuna`;
}

function getTreatBoost() {
  return Date.now() < state.boostEndsAt ? 2 : 1;
}

function getAchievementBoost() {
  return Date.now() < state.achievementBoostEndsAt ? 3 : 1;
}

function getCatnipBoost() {
  return Date.now() < state.catnipEndsAt ? 5 : 1;
}

function getComboBoost() {
  return 1 + Math.min(2, Math.floor(state.comboStreak / 25) * 0.25);
}

function getPostcardBoost() {
  return 1 + state.postcards * 0.01;
}

function getWeatherEvent() {
  if (Date.now() > state.weatherEndsAt) {
    return weatherEvents[0];
  }

  return weatherEvents.find((event) => event.name === state.weather) || weatherEvents[0];
}

function getBoostSecondsLeft() {
  return Math.max(0, Math.ceil((state.boostEndsAt - Date.now()) / 1000));
}

function getAchievementBoostSecondsLeft() {
  return Math.max(0, Math.ceil((state.achievementBoostEndsAt - Date.now()) / 1000));
}

function getCatnipSecondsLeft() {
  return Math.max(0, Math.ceil((state.catnipEndsAt - Date.now()) / 1000));
}

function getRebirthBoost() {
  return 2 ** state.rebirths;
}

function getRebirthCost() {
  return firstRebirthCost * 10 ** state.rebirths;
}

function hasRebirthUnlocks() {
  return state.rebirths > 0;
}

function getPerClick() {
  return (
    (state.multiplier + state.luckyBells * 0.1) *
    state.prestigeClickBoost *
    getComboBoost() *
    getPostcardBoost() *
    getWeatherEvent().boost *
    getTreatBoost() *
    getAchievementBoost() *
    getCatnipBoost() *
    getRebirthBoost()
  );
}

function getJackpotNeeded() {
  return 500;
}

function getNapCooldownLeft() {
  return Math.max(0, 300000 - (Date.now() - state.lastNapAt));
}

function getPlayerTitle() {
  return playerTitles.reduce((best, title) => (state.clicks >= title.clicks ? title : best), playerTitles[0]).title;
}

function getBossReward() {
  return getPerClick() * (500 + state.bossesDefeated * 150) * (1 + state.bossBountyLevel * 0.5);
}

function getWheelCooldownLeft() {
  return Math.max(0, oneDayMs - (Date.now() - state.lastWheelSpin));
}

function formatTime(ms) {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.ceil((ms % 3600000) / 60000);

  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}

function getBestOwnedCat() {
  if (state.hasLarryCat) {
    return "larry";
  }

  if (state.hasSoggyCat) {
    return "soggy";
  }

  if (state.hasGlorbzorgCat) {
    return "glorbzorg";
  }

  if (state.hasGlungusCat) {
    return "glungus";
  }

  if (state.hasWettyCat) {
    return "wetty";
  }

  if (state.hasWarCat) {
    return "war";
  }

  if (state.hasGoldenCat) {
    return "golden";
  }

  if (state.hasEmoCat) {
    return "emo";
  }

  if (state.hasPremiumCat) {
    return "premium";
  }

  return "normal";
}

function setEquippedCat(cat) {
  state.equippedCat = cat;
  els.combo.textContent = `${cat === "larry" ? "Evil Larry" : `${cat[0].toUpperCase()}${cat.slice(1)} cat`} equipped`;
  startBackgroundMusic(getActiveMusicCat());
  render();
  saveGame();
}

function renderCatUpgrade(button, costEl, isOwned, equippedId, priceText) {
  if (isOwned) {
    costEl.textContent = state.equippedCat === equippedId ? "Equipped" : "Equip";
    button.disabled = state.equippedCat === equippedId;
    return;
  }

  costEl.textContent = priceText;
}

function renderAchievements() {
  const unlockedCount = clickAchievements.filter((achievement) => state.clicks >= achievement.clicks).length;
  const nextRenderKey = `${unlockedCount}|${state.claimedAchievements.join(",")}|${clickAchievements.map((achievement) => achievement.title).join("|")}`;

  els.achievementCount.textContent = `${unlockedCount}/${clickAchievements.length}`;

  if (nextRenderKey === achievementRenderKey) {
    return;
  }

  achievementRenderKey = nextRenderKey;
  els.achievementList.replaceChildren(
    ...clickAchievements.map((achievement) => {
      const isUnlocked = state.clicks >= achievement.clicks;
      const isClaimed = state.claimedAchievements.includes(achievement.clicks);
      const item = document.createElement("div");
      item.className = `achievement${isUnlocked ? " unlocked" : ""}${isClaimed ? " claimed" : ""}`;

      const text = document.createElement("span");
      text.textContent = achievement.title;

      const status = document.createElement(isUnlocked && !isClaimed ? "button" : "strong");
      status.textContent = isClaimed ? "Claimed" : isUnlocked ? "Claim" : achievement.clicks.toLocaleString("en-US");

      if (isUnlocked && !isClaimed) {
        status.className = "achievement-claim";
        status.type = "button";
        status.dataset.clicks = String(achievement.clicks);
        status.setAttribute("aria-label", `Claim ${achievement.title}`);
      }

      item.append(text, status);
      return item;
    }),
  );
}

function renderCityJobs() {
  els.cityJobsList.replaceChildren(
    ...cityJobs.map((job) => {
      const item = document.createElement("div");
      const claimed = state.cityJobsClaimed.includes(job.id);
      const done = job.isDone();
      const label = document.createElement("span");
      const button = document.createElement("button");

      item.className = `mini-task${done ? " done" : ""}${claimed ? " claimed" : ""}`;
      label.textContent = job.label;
      button.type = "button";
      button.textContent = claimed ? "Claimed" : done ? "Claim" : "Locked";
      button.disabled = claimed || !done;
      button.dataset.jobId = job.id;
      item.append(label, button);
      return item;
    }),
  );
}

function render() {
  const boostSeconds = getBoostSecondsLeft();
  const achievementBoostSeconds = getAchievementBoostSecondsLeft();
  const rebirthCost = getRebirthCost();
  const rebirthUnlocked = hasRebirthUnlocks();

  if (!rebirthUnlocked) {
    els.shopScreen.classList.remove("open");
  }

  els.money.textContent = formatMoney(state.money);
  els.perClick.textContent = formatMoney(getPerClick());
  els.multiplier.textContent = `x${state.multiplier.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
  els.tunaCans.textContent = rebirthUnlocked ? state.tunaCans.toLocaleString("en-US") : "Locked";
  els.rebirths.textContent = state.rebirths.toLocaleString("en-US");
  els.playerTitle.textContent = getPlayerTitle();
  els.clicks.textContent = state.clicks.toLocaleString("en-US");
  els.rebirthBoost.textContent = `x${getRebirthBoost().toLocaleString("en-US")}`;
  els.kittiGoods.textContent = rebirthUnlocked ? state.kittiGoods.toLocaleString("en-US") : "Locked";
  els.bossName.textContent = state.bossActive ? `Boss Cat ${state.bossesDefeated + 1}` : "No Boss";
  els.bossHp.textContent = state.bossActive
    ? `${formatMoney(state.bossHp)} / ${formatMoney(state.bossMaxHp)} HP`
    : `${state.bossesDefeated.toLocaleString("en-US")} defeated`;
  els.bossBar.style.width = state.bossActive ? `${Math.max(0, (state.bossHp / state.bossMaxHp) * 100)}%` : "0%";
  els.stageBossHealth.classList.toggle("show", state.bossActive);
  els.stageBossName.textContent = `Boss Cat ${state.bossesDefeated + 1}`;
  els.stageBossHp.textContent = `${formatMoney(state.bossHp)} / ${formatMoney(state.bossMaxHp)} HP`;
  els.stageBossBar.style.width = state.bossActive ? `${Math.max(0, (state.bossHp / state.bossMaxHp) * 100)}%` : "0%";
  const catnipSeconds = getCatnipSecondsLeft();
  els.catnipMeter.textContent = catnipSeconds > 0 ? `x5 ${catnipSeconds}s` : `${state.catnipEnergy}/100`;
  els.catnipBar.style.width = catnipSeconds > 0 ? "100%" : `${state.catnipEnergy}%`;
  els.catnipStatus.textContent = catnipSeconds > 0 ? "CATNIP FEVER ACTIVE" : "100 clicks charges x5 fever";
  els.chestButton.textContent = state.chestsReady > 0 ? `Open Chest (${state.chestsReady})` : "No Chest";
  els.chestButton.disabled = state.chestsReady <= 0;
  els.chestStatus.textContent = `${state.chestsOpened.toLocaleString("en-US")} opened`;
  els.comboRush.textContent = `Combo x${getComboBoost().toLocaleString("en-US", { maximumFractionDigits: 2 })} (${state.comboStreak})`;
  els.jackpotMeter.textContent = `${state.jackpotClicks}/${getJackpotNeeded()}`;
  els.bankStatus.textContent = `Level ${state.bankLevel} - ${formatMoney(state.bankCost)}`;
  els.bankButton.disabled = state.money < getPrice(state.bankCost);
  els.scratchStatus.textContent = formatMoney(state.scratchCost);
  els.scratchButton.disabled = state.money < getPrice(state.scratchCost);
  els.tunaMagnetStatus.textContent = `Level ${state.tunaMagnetLevel} - ${formatTunaPrice(state.tunaMagnetCost)}`;
  els.tunaMagnetButton.disabled = !rebirthUnlocked || state.tunaCans < getPrice(state.tunaMagnetCost);
  els.slotStatus.textContent = formatMoney(state.slotCost);
  els.slotButton.disabled = state.money < getPrice(state.slotCost);
  els.postcardStatus.textContent = `${state.postcards} cards - ${formatMoney(state.postcardCost)}`;
  els.postcardButton.disabled = state.money < getPrice(state.postcardCost);
  const weatherEvent = getWeatherEvent();
  const weatherSeconds = Math.max(0, Math.ceil((state.weatherEndsAt - Date.now()) / 1000));
  els.weatherStatus.textContent = weatherSeconds > 0
    ? `${weatherEvent.name}: ${weatherEvent.note} (${weatherSeconds}s)`
    : "Sunny: normal clicking";
  els.weatherButton.disabled = state.money < getPrice(state.weatherCost);
  const napCooldown = getNapCooldownLeft();
  els.napStatus.textContent = napCooldown > 0 ? `Ready in ${formatTime(napCooldown)}` : `Claim ${formatMoney(getPerClick() * 60)}`;
  els.napButton.disabled = napCooldown > 0;
  els.panicStatus.textContent = `${formatTunaPrice(state.panicCost)} for panic boost`;
  els.panicButton.disabled = !rebirthUnlocked || state.tunaCans < getPrice(state.panicCost);
  els.bossButton.textContent = state.bossActive ? "Boss Active" : "Summon Boss Cat";
  els.bossButton.disabled = state.bossActive;
  els.bossReward.textContent = `Reward: ${formatMoney(getBossReward())}`;
  els.eggButton.disabled = !rebirthUnlocked || state.tunaCans < 25;
  els.wheelButton.disabled = getWheelCooldownLeft() > 0;
  els.wheelStatus.textContent = getWheelCooldownLeft() > 0 ? `Come back in ${formatTime(getWheelCooldownLeft())}` : "Ready to spin";
  els.fusionButton.disabled = state.hasSadboiFusion || !state.hasGoldenCat || !state.hasEmoCat || !rebirthUnlocked || state.tunaCans < 50;
  els.fusionStatus.textContent = state.hasSadboiFusion
    ? "Golden Sadboi Fusion active: permanent x2"
    : "Needs Golden Cat, Emo Y2K, 50 tuna";
  els.prestigeClickButton.disabled = state.kittiGoods < 3;
  els.prestigeTunaButton.disabled = state.kittiGoods < 2;
  els.prestigeBossButton.disabled = state.kittiGoods < 2;
  els.boostTimer.textContent =
    boostSeconds > 0 && achievementBoostSeconds > 0
      ? `${boostSeconds}s + 3x ${achievementBoostSeconds}s`
      : achievementBoostSeconds > 0
        ? `3x ${achievementBoostSeconds}s`
        : boostSeconds > 0
          ? `${boostSeconds}s`
          : "Ready";
  els.multiplierCost.textContent =
    state.multiplierLevel >= multiplierMaxLevel ? `Max ${multiplierMaxLevel}` : formatCatPrice(state.multiplierCost);
  els.treatCost.textContent = formatCatPrice(state.treatCost);
  els.rebirthCost.textContent = formatCatPrice(rebirthCost);
  els.yarnCost.textContent = formatTunaPrice(1);
  els.fishCost.textContent = formatTunaPrice(3);
  els.bellCost.textContent = formatTunaPrice(8);
  els.couponCost.textContent = formatTunaPrice(5);
  els.enterShopButton.textContent = rebirthUnlocked ? "Enter Kitteys Shop" : "Rebirth Unlocks Shop";
  els.exchangeTunaButton.textContent = rebirthUnlocked ? "Exchange Clicks" : "Rebirth Unlocks Tuna";
  renderAchievements();
  renderCityJobs();
  renderCatUpgrade(els.catUpgradeButton, els.catUpgradeCost, state.hasPremiumCat, "premium", formatCatPrice(state.catUpgradeCost));
  renderCatUpgrade(els.goldenCatButton, els.goldenCatCost, state.hasGoldenCat, "golden", formatCatPrice(state.goldenCatCost));
  renderCatUpgrade(els.emoCatButton, els.emoCatCost, state.hasEmoCat, "emo", formatCatPrice(state.emoCatCost));
  renderCatUpgrade(els.warCatButton, els.warCatCost, state.hasWarCat, "war", formatCatPrice(state.warCatCost));
  renderCatUpgrade(
    els.larryCatButton,
    els.larryCatCost,
    state.hasLarryCat,
    "larry",
    formatClickPrice(state.larryCatCost),
  );
  renderCatUpgrade(
    els.larryShopButton,
    els.larryShopCost,
    state.hasLarryCat,
    "larry",
    formatClickPrice(state.larryCatCost),
  );
  renderCatUpgrade(
    els.wettyCatButton,
    els.wettyCatCost,
    state.hasWettyCat,
    "wetty",
    formatClickPrice(state.wettyCatCost),
  );
  renderCatUpgrade(
    els.wettyShopButton,
    els.wettyShopCost,
    state.hasWettyCat,
    "wetty",
    formatClickPrice(state.wettyCatCost),
  );
  renderCatUpgrade(
    els.glungusCatButton,
    els.glungusCatCost,
    state.hasGlungusCat,
    "glungus",
    formatCatPrice(state.glungusCatCost),
  );
  renderCatUpgrade(
    els.glorbzorgCatButton,
    els.glorbzorgCatCost,
    state.hasGlorbzorgCat,
    "glorbzorg",
    formatCatPrice(state.glorbzorgCatCost),
  );
  renderCatUpgrade(els.soggyCatButton, els.soggyCatCost, state.hasSoggyCat, "soggy", formatCatPrice(state.soggyCatCost));
  els.catButton.classList.toggle("premium-cat", state.equippedCat === "premium");
  els.catButton.classList.toggle("golden-cat", state.equippedCat === "golden");
  els.catButton.classList.toggle("emo-cat", state.equippedCat === "emo");
  els.catButton.classList.toggle("war-cat", state.equippedCat === "war");
  els.catButton.classList.toggle("larry-cat", state.equippedCat === "larry");
  els.catButton.classList.toggle("wetty-cat", state.equippedCat === "wetty");
  els.catButton.classList.toggle("glungus-cat", state.equippedCat === "glungus");
  els.catButton.classList.toggle("glorbzorg-cat", state.equippedCat === "glorbzorg");
  els.catButton.classList.toggle("soggy-cat", state.equippedCat === "soggy");
  els.catButton.classList.toggle("boss-cat", state.bossActive);
  updateMusicButton();

  els.multiplierButton.disabled = state.multiplierLevel >= multiplierMaxLevel || state.money < getPrice(state.multiplierCost);
  els.treatButton.disabled = state.money < getPrice(state.treatCost) || boostSeconds > 0;
  els.exchangeTunaButton.disabled = !rebirthUnlocked || state.clicks - state.exchangedTunaClicks < 10;
  els.enterShopButton.disabled = !rebirthUnlocked;
  els.rebirthButton.disabled = state.money < getPrice(rebirthCost);
  els.yarnButton.disabled = !rebirthUnlocked || state.tunaCans < getPrice(1);
  els.fishButton.disabled = !rebirthUnlocked || state.tunaCans < getPrice(3);
  els.bellButton.disabled = !rebirthUnlocked || state.tunaCans < getPrice(8);
  els.couponButton.disabled = !rebirthUnlocked || state.tunaCans < getPrice(5);
  els.catUpgradeButton.disabled = state.hasPremiumCat
    ? state.equippedCat === "premium"
    : state.money < getPrice(state.catUpgradeCost);
  els.goldenCatButton.disabled = state.hasGoldenCat
    ? state.equippedCat === "golden"
    : state.money < getPrice(state.goldenCatCost);
  els.emoCatButton.disabled = state.hasEmoCat ? state.equippedCat === "emo" : state.money < getPrice(state.emoCatCost);
  els.warCatButton.disabled = state.hasWarCat ? state.equippedCat === "war" : state.money < getPrice(state.warCatCost);
  els.larryCatButton.disabled = state.hasLarryCat ? state.equippedCat === "larry" : state.clicks < getPrice(state.larryCatCost);
  els.larryShopButton.disabled = state.hasLarryCat ? state.equippedCat === "larry" : state.clicks < getPrice(state.larryCatCost);
  els.wettyCatButton.disabled = state.hasWettyCat ? state.equippedCat === "wetty" : state.clicks < getPrice(state.wettyCatCost);
  els.wettyShopButton.disabled = state.hasWettyCat ? state.equippedCat === "wetty" : state.clicks < getPrice(state.wettyCatCost);
  els.glungusCatButton.disabled = state.hasGlungusCat
    ? state.equippedCat === "glungus"
    : state.money < getPrice(state.glungusCatCost);
  els.glorbzorgCatButton.disabled = state.hasGlorbzorgCat
    ? state.equippedCat === "glorbzorg"
    : state.money < getPrice(state.glorbzorgCatCost);
  els.soggyCatButton.disabled = state.hasSoggyCat ? state.equippedCat === "soggy" : state.money < getPrice(state.soggyCatCost);
}

function showMoneyPop(amount, event) {
  const pop = document.createElement("span");
  pop.className = "pop";
  pop.textContent = `+${formatMoney(amount)}`;
  pop.style.left = `${event.clientX}px`;
  pop.style.top = `${event.clientY}px`;
  document.body.append(pop);
  window.setTimeout(() => pop.remove(), 850);
}

function pulseCat() {
  els.catButton.classList.add("clicked");
  window.setTimeout(() => els.catButton.classList.remove("clicked"), 120);
}

function showExchangeBubble() {
  els.exchangeBubble.classList.remove("show");
  void els.exchangeBubble.offsetWidth;
  els.exchangeBubble.classList.add("show");
}

function showAchievementPopup(achievement) {
  els.achievementPopup.innerHTML = `
    <span>Achievement unlocked</span>
    <strong>${achievement.title}</strong>
    <small>${achievement.clicks.toLocaleString("en-US")} clicks - claim 3x boost</small>
  `;
  els.achievementPopup.classList.remove("show");
  void els.achievementPopup.offsetWidth;
  els.achievementPopup.classList.add("show");
}

function showAchievementClaimPopup(achievement) {
  els.achievementPopup.innerHTML = `
    <span>Reward claimed</span>
    <strong>${achievement.title}</strong>
    <small>3x multiplier for 10s</small>
  `;
  els.achievementPopup.classList.remove("show");
  void els.achievementPopup.offsetWidth;
  els.achievementPopup.classList.add("show");
}

function checkAchievementPopups(previousClicks) {
  const unlocked = clickAchievements.filter((achievement) => previousClicks < achievement.clicks && state.clicks >= achievement.clicks);

  if (unlocked.length === 0) {
    return;
  }

  els.combo.textContent = "Achievement ready to claim";
  unlocked.forEach((achievement, index) => {
    window.setTimeout(() => showAchievementPopup(achievement), index * 450);
  });
}

function claimAchievement(clicks) {
  const achievement = clickAchievements.find((item) => item.clicks === clicks);

  if (!achievement || state.clicks < achievement.clicks || state.claimedAchievements.includes(achievement.clicks)) {
    return;
  }

  state.claimedAchievements.push(achievement.clicks);
  state.achievementBoostEndsAt = Math.max(state.achievementBoostEndsAt, Date.now()) + 10000;
  els.combo.textContent = "Achievement boost: 3x for 10 seconds";
  showAchievementClaimPopup(achievement);
  render();
  saveGame();
}

function chargeCatnip() {
  if (getCatnipSecondsLeft() > 0) {
    return;
  }

  state.catnipEnergy = Math.min(100, state.catnipEnergy + 1);

  if (state.catnipEnergy >= 100) {
    state.catnipEnergy = 0;
    state.catnipEndsAt = Date.now() + 15000;
    els.combo.textContent = "CATNIP FEVER: x5 for 15 seconds";
  }
}

function checkMysteryChest(previousClicks) {
  const oldChestMilestone = Math.floor(previousClicks / 250);
  const newChestMilestone = Math.floor(state.clicks / 250);

  if (newChestMilestone <= oldChestMilestone) {
    return;
  }

  state.chestsReady += newChestMilestone - oldChestMilestone;
  els.combo.textContent = "Mystery chest ready";
}

function openMysteryChest() {
  if (state.chestsReady <= 0) {
    return;
  }

  const prizes = [
    () => {
      const payout = getPerClick() * 180;
      state.money += payout;
      return `${formatMoney(payout)}`;
    },
    () => {
      if (hasRebirthUnlocks()) {
        state.tunaCans += 15;
        return "15 tuna";
      }

      const payout = getPerClick() * 100;
      state.money += payout;
      return `${formatMoney(payout)}`;
    },
    () => {
      state.boostEndsAt = Math.max(state.boostEndsAt, Date.now()) + 20000;
      return "20s treat boost";
    },
    () => {
      state.multiplier *= 1.03;
      return "permanent x1.03 multi";
    },
  ];
  const prize = prizes[Math.floor(Math.random() * prizes.length)]();

  state.chestsReady -= 1;
  state.chestsOpened += 1;
  els.combo.textContent = `Mystery chest: ${prize}`;
  render();
  saveGame();
}

function checkJackpot() {
  if (state.jackpotClicks < getJackpotNeeded()) {
    return;
  }

  state.jackpotClicks = 0;
  state.chestsReady += 3;
  state.catnipEndsAt = Math.max(state.catnipEndsAt, Date.now()) + 10000;
  els.combo.textContent = "JACKPOT: 3 chests and 10s catnip fever";
}

function buyBankLevel() {
  const cost = getPrice(state.bankCost);

  if (state.money < cost) {
    return;
  }

  state.money -= cost;
  state.bankLevel += 1;
  state.bankCost = Math.ceil(state.bankCost * 2.5);
  els.combo.textContent = `Kitti Bank level ${state.bankLevel}`;
  render();
  saveGame();
}

function buyScratchCard() {
  const cost = getPrice(state.scratchCost);

  if (state.money < cost) {
    return;
  }

  state.money -= cost;
  const prize = scratchPrizes[Math.floor(Math.random() * scratchPrizes.length)];
  const result = prize.action();
  state.scratchCost = Math.ceil(state.scratchCost * 1.12);
  els.combo.textContent = `Scratch card: ${prize.label} (${result})`;
  render();
  saveGame();
}

function buyTunaMagnet() {
  const cost = getPrice(state.tunaMagnetCost);

  if (!hasRebirthUnlocks() || state.tunaCans < cost) {
    return;
  }

  state.tunaCans -= cost;
  state.tunaMagnetLevel += 1;
  state.tunaMagnetCost = Math.ceil(state.tunaMagnetCost * 1.8);
  els.combo.textContent = `Tuna Magnet level ${state.tunaMagnetLevel}`;
  render();
  saveGame();
}

function playSlots() {
  const cost = getPrice(state.slotCost);

  if (state.money < cost) {
    return;
  }

  state.money -= cost;
  const roll = Math.random();

  if (roll < 0.08) {
    const payout = getPerClick() * 2000;
    state.money += payout;
    state.chestsReady += 2;
    els.combo.textContent = `SLOTS JACKPOT: ${formatMoney(payout)} and 2 chests`;
  } else if (roll < 0.35) {
    const payout = getPerClick() * 350;
    state.money += payout;
    els.combo.textContent = `Slots won ${formatMoney(payout)}`;
  } else if (roll < 0.62) {
    state.catnipEnergy = Math.min(100, state.catnipEnergy + 35);
    els.combo.textContent = "Slots charged catnip +35";
  } else {
    els.combo.textContent = "Slots said nope";
  }

  state.slotCost = Math.ceil(state.slotCost * 1.08);
  render();
  saveGame();
}

function buyPostcard() {
  const cost = getPrice(state.postcardCost);

  if (state.money < cost) {
    return;
  }

  state.money -= cost;
  state.postcards += 1;
  state.postcardCost = Math.ceil(state.postcardCost * 1.45);
  els.combo.textContent = `Postcard collected. Permanent +${state.postcards}% clicks`;
  render();
  saveGame();
}

function rollWeather() {
  const cost = getPrice(state.weatherCost);

  if (state.money < cost) {
    return;
  }

  state.money -= cost;
  const event = weatherEvents[1 + Math.floor(Math.random() * (weatherEvents.length - 1))];
  state.weather = event.name;
  state.weatherEndsAt = Date.now() + 60000;
  state.weatherCost = Math.ceil(state.weatherCost * 1.18);
  els.combo.textContent = `Weather changed: ${event.name}`;
  render();
  saveGame();
}

function claimNap() {
  if (getNapCooldownLeft() > 0) {
    return;
  }

  const payout = getPerClick() * 60;
  state.money += payout;
  state.lastNapAt = Date.now();
  els.combo.textContent = `Good nap: ${formatMoney(payout)}`;
  render();
  saveGame();
}

function panicMeow() {
  const cost = getPrice(state.panicCost);

  if (!hasRebirthUnlocks() || state.tunaCans < cost) {
    return;
  }

  state.tunaCans -= cost;
  state.catnipEndsAt = Math.max(state.catnipEndsAt, Date.now()) + 8000;
  state.chestsReady += 1;
  state.panicCost = Math.ceil(state.panicCost * 1.6);
  els.combo.textContent = "PANIC MEOW: fever and a chest";
  render();
  saveGame();
}

function passiveTick() {
  let gained = 0;

  if (state.bankLevel > 0) {
    gained += getPerClick() * state.bankLevel * 0.08;
  }

  if (gained > 0) {
    state.money += gained;
    if (state.bossActive) {
      damageBoss(gained);
    }
    render();
    saveGame();
  }
}

function summonBoss() {
  if (state.bossActive) {
    return;
  }

  state.bossMaxHp = Math.ceil(getPerClick() * (180 + state.bossesDefeated * 80));
  state.bossHp = state.bossMaxHp;
  state.bossActive = true;
  els.combo.textContent = `Boss Cat ${state.bossesDefeated + 1} appeared`;
  startBackgroundMusic("boss");
  render();
  saveGame();
}

function damageBoss(damage) {
  if (!state.bossActive) {
    return false;
  }

  state.bossHp = Math.max(0, state.bossHp - damage);

  if (state.bossHp > 0) {
    return false;
  }

  const reward = getBossReward();
  const tunaReward = hasRebirthUnlocks() ? 5 + state.bossesDefeated + state.bossBountyLevel : 0;
  state.bossActive = false;
  state.bossesDefeated += 1;
  state.money += reward;
  state.tunaCans += tunaReward;
  els.combo.textContent = `Boss defeated: ${formatMoney(reward)}${tunaReward ? ` and ${tunaReward} tuna` : ""}`;
  startBackgroundMusic(state.equippedCat);
  return true;
}

function hatchEgg() {
  spendTuna(25, () => {
    const roll = Math.random() * 100;
    let total = 0;
    const drop = eggDrops.find((item) => {
      total += item.chance;
      return roll <= total;
    }) || eggDrops[0];
    const payout = getPerClick() * drop.moneyClicks;

    state.money += payout;
    state.tunaCans += drop.tuna;

    if (drop.multiplier > 1) {
      state.multiplier *= drop.multiplier;
    }

    els.eggResult.textContent = `${drop.rarity}: ${drop.name}`;
    els.combo.textContent = `Egg gave ${formatMoney(payout)}, ${drop.tuna} tuna${drop.multiplier > 1 ? ", and multi luck" : ""}`;
  });
}

function spinWheel() {
  if (getWheelCooldownLeft() > 0) {
    return;
  }

  const prizes = [
    () => {
      const payout = getPerClick() * 250;
      state.money += payout;
      return `${formatMoney(payout)}`;
    },
    () => {
      state.tunaCans += hasRebirthUnlocks() ? 30 : 0;
      return hasRebirthUnlocks() ? "30 tuna" : "rebirth first for tuna prizes";
    },
    () => {
      state.boostEndsAt = Date.now() + 60000;
      return "60 second treat boost";
    },
    () => {
      state.multiplier *= 1.1;
      return "permanent x1.1 multiplier";
    },
  ];
  const prize = prizes[Math.floor(Math.random() * prizes.length)]();

  state.lastWheelSpin = Date.now();
  els.combo.textContent = `Wheel prize: ${prize}`;
  render();
  saveGame();
}

function fuseCats() {
  if (state.hasSadboiFusion || !state.hasGoldenCat || !state.hasEmoCat) {
    return;
  }

  spendTuna(50, () => {
    state.hasSadboiFusion = true;
    state.multiplier *= 2;
    els.combo.textContent = "Golden Sadboi Fusion created. Permanent x2";
  });
}

function buyPrestigeUpgrade(kind) {
  const costs = { click: 3, tuna: 2, boss: 2 };
  const cost = costs[kind];

  if (state.kittiGoods < cost) {
    return;
  }

  state.kittiGoods -= cost;

  if (kind === "click") {
    state.prestigeClickBoost *= 1.5;
    els.combo.textContent = "Prestige clicks boosted by 50%";
  }

  if (kind === "tuna") {
    state.tunaExchangeBonus += 1;
    els.combo.textContent = "Tuna exchange gives +1 can every time";
  }

  if (kind === "boss") {
    state.bossBountyLevel += 1;
    els.combo.textContent = "Boss rewards got bigger";
  }

  render();
  saveGame();
}

function clickCat(event) {
  const earned = getPerClick();
  const previousClicks = state.clicks;
  const now = Date.now();

  state.comboStreak = now - state.lastClickAt < 1200 ? state.comboStreak + 1 : 1;
  state.lastClickAt = now;
  state.money += earned;
  state.clicks += 1;
  state.jackpotClicks += 1;
  chargeCatnip();
  checkMysteryChest(previousClicks);
  checkJackpot();
  const defeatedBoss = damageBoss(earned);
  if (!defeatedBoss && state.chestsReady === 0 && getCatnipSecondsLeft() === 0) {
    els.combo.textContent = "click";
  }
  checkAchievementPopups(previousClicks);

  pulseCat();
  if (!isMusicPlaying && getTheme(getActiveMusicCat()).src) {
    startBackgroundMusic();
  }
  showMoneyPop(earned, event);
  render();
  saveGame();
}

function buyUpgrade(costKey, effect, nextCost) {
  const rawCost = state[costKey];
  const cost = getPrice(rawCost);

  if (state.money < cost) {
    return;
  }

  state.money -= cost;
  effect();
  state[costKey] = nextCost(rawCost);
  render();
  saveGame();
}

function resetRunProgress() {
  Object.assign(state, {
    money: 0,
    multiplier: 1,
    multiplierLevel: 0,
    clicks: 0,
    tunaCans: 0,
    exchangedTunaClicks: 0,
    luckyBells: 0,
    bossActive: false,
    bossHp: 0,
    bossMaxHp: 0,
    catnipEnergy: 0,
    catnipEndsAt: 0,
    chestsReady: 0,
    bankLevel: 0,
    bankCost: 1000000,
    scratchCost: 50000,
    tunaMagnetLevel: 0,
    tunaMagnetCost: 20,
    jackpotClicks: 0,
    comboStreak: 0,
    lastClickAt: 0,
    slotCost: 75000,
    postcards: 0,
    postcardCost: 150000,
    weather: "Sunny",
    weatherEndsAt: 0,
    weatherCost: 100000,
    lastNapAt: 0,
    panicCost: 10,
    claimedAchievements: [],
    boostEndsAt: 0,
    achievementBoostEndsAt: 0,
    hasPremiumCat: false,
    hasGoldenCat: false,
    hasEmoCat: false,
    hasWarCat: false,
    hasLarryCat: false,
    hasWettyCat: false,
    hasGlungusCat: false,
    hasGlorbzorgCat: false,
    hasSoggyCat: false,
    larryMultiplierApplied: 100,
    glorbzorgMultiplierApplied: 50,
    equippedCat: "normal",
    multiplierCost: 25,
    treatCost: 120,
    catUpgradeCost: 10000,
    goldenCatCost: 500000,
    emoCatCost: 500000,
    warCatCost: 100000000,
    larryCatCost: 3000,
    wettyCatCost: 1500,
    glungusCatCost: 10000000000,
    glorbzorgCatCost: 1000000000000,
    soggyCatCost: 5000000000000,
  });
  achievementRenderKey = "";
}

function resetGame() {
  const confirmed = window.confirm("Reset your cat fortune and start over?");

  if (!confirmed) {
    return;
  }

  resetRunProgress();
  state.rebirths = 0;
  state.kittiGoods = 0;
  state.bossesDefeated = 0;
  state.lastWheelSpin = 0;
  state.cityJobsClaimed = [];
  state.hasSadboiFusion = false;
  state.prestigeClickBoost = 1;
  state.tunaExchangeBonus = 0;
  state.bossBountyLevel = 0;
  state.chestsOpened = 0;
  els.combo.textContent = "Fresh cat, fresh wallet";
  saveGame();
  render();
}

function rebirth() {
  const rebirthCost = getRebirthCost();
  const price = getPrice(rebirthCost);

  if (state.money < price) {
    return;
  }

  state.rebirths += 1;
  resetRunProgress();
  state.kittiGoods += 1;
  els.shopScreen.classList.remove("open");
  els.combo.textContent = `Rebirth ${state.rebirths} complete. Permanent x${getRebirthBoost().toLocaleString("en-US")} power`;
  setMusicTheme("normal");
  saveGame();
  render();
}

function renderCitiPlayer() {
  els.citiPlayer.style.transform = `translate(${citiPlayerPosition.x}px, ${citiPlayerPosition.y}px)`;
}

function moveCitiPlayer(deltaX, deltaY) {
  const bounds = els.citiGrid.getBoundingClientRect();
  const playerBounds = els.citiPlayer.getBoundingClientRect();
  const maxX = Math.max(0, bounds.width - playerBounds.width - 8);
  const maxY = Math.max(0, bounds.height - playerBounds.height - 8);

  citiPlayerPosition.x = Math.min(maxX, Math.max(8, citiPlayerPosition.x + deltaX));
  citiPlayerPosition.y = Math.min(maxY, Math.max(8, citiPlayerPosition.y + deltaY));
  renderCitiPlayer();
}

function openCitiShop(shopId) {
  const shop = citiShops[shopId];

  if (!shop) {
    return;
  }

  els.citiShopImage.src = shop.image;
  els.citiShopTitle.textContent = shop.title;
  els.citiShopDescription.textContent = shop.description;
  els.citiShopItems.replaceChildren(
    ...shop.items.map((item) => {
      const row = document.createElement("div");
      row.className = "citi-shop-item";

      const name = document.createElement("strong");
      name.textContent = item.name;

      const buyButton = document.createElement("button");
      buyButton.className = "citi-shop-buy";
      buyButton.type = "button";
      buyButton.textContent = formatTunaPrice(item.cost);
      buyButton.disabled = !hasRebirthUnlocks() || state.tunaCans < getPrice(item.cost);
      buyButton.addEventListener("click", () => {
        const price = getPrice(item.cost);

        if (!hasRebirthUnlocks()) {
          els.combo.textContent = "Rebirth once to buy city goods";
          return;
        }

        if (state.tunaCans < price) {
          els.combo.textContent = "need more tuna";
          return;
        }

        state.tunaCans -= price;
        state.money += getPerClick() * item.cost * 20;
        els.combo.textContent = `${item.name} bought`;
        openCitiShop(shopId);
        render();
        saveGame();
      });

      row.append(name, buyButton);
      return row;
    }),
  );
  els.citiShopPanel.classList.add("open");
}

function closeCitiShop() {
  els.citiShopPanel.classList.remove("open");
  els.citiGrid.focus();
}

function setArea(area) {
  const isCiti = area === "citi";

  els.shopScreen.classList.remove("open");
  closeCitiShop();
  els.citiScreen.classList.toggle("open", isCiti);
  document.querySelector("#app").classList.toggle("citi-open", isCiti);
  els.kittiCitiTab.classList.toggle("active", isCiti);
  els.clickerTab.classList.toggle("active", !isCiti);
  els.combo.textContent = isCiti ? "welcome to kitti citi" : "back to kitti kliker";

  if (isCiti) {
    window.setTimeout(() => {
      renderCitiPlayer();
      els.citiGrid.focus();
    }, 0);
  }
}

els.catButton.addEventListener("click", clickCat);
els.chestButton.addEventListener("click", openMysteryChest);
els.bankButton.addEventListener("click", buyBankLevel);
els.scratchButton.addEventListener("click", buyScratchCard);
els.tunaMagnetButton.addEventListener("click", buyTunaMagnet);
els.slotButton.addEventListener("click", playSlots);
els.postcardButton.addEventListener("click", buyPostcard);
els.weatherButton.addEventListener("click", rollWeather);
els.napButton.addEventListener("click", claimNap);
els.panicButton.addEventListener("click", panicMeow);

els.bossButton.addEventListener("click", summonBoss);
els.eggButton.addEventListener("click", hatchEgg);
els.wheelButton.addEventListener("click", spinWheel);
els.fusionButton.addEventListener("click", fuseCats);
els.prestigeClickButton.addEventListener("click", () => buyPrestigeUpgrade("click"));
els.prestigeTunaButton.addEventListener("click", () => buyPrestigeUpgrade("tuna"));
els.prestigeBossButton.addEventListener("click", () => buyPrestigeUpgrade("boss"));

els.cityJobsList.addEventListener("click", (event) => {
  const button = event.target instanceof Element ? event.target.closest("button[data-job-id]") : null;

  if (!button) {
    return;
  }

  const job = cityJobs.find((item) => item.id === button.dataset.jobId);

  if (!job || !job.isDone() || state.cityJobsClaimed.includes(job.id)) {
    return;
  }

  const reward = job.reward();
  state.cityJobsClaimed.push(job.id);
  els.combo.textContent = `Job complete: ${reward}`;
  render();
  saveGame();
});

els.achievementList.addEventListener("click", (event) => {
  const button = event.target instanceof Element ? event.target.closest(".achievement-claim") : null;

  if (!button) {
    return;
  }

  claimAchievement(Number(button.dataset.clicks));
});

els.easterCat.addEventListener("click", () => {
  els.combo.textContent = "but is it possible with accurate hitboxes";
});

els.kittiCitiTab.addEventListener("click", () => {
  setArea("citi");
});

els.clickerTab.addEventListener("click", () => {
  setArea("clicker");
});

els.citiBackButton.addEventListener("click", () => {
  setArea("clicker");
});

els.citiGrid.addEventListener("click", (event) => {
  const booth = event.target instanceof Element ? event.target.closest(".citi-booth") : null;

  if (!booth) {
    return;
  }

  openCitiShop(booth.dataset.citiShop);
});

els.citiGrid.addEventListener("keydown", (event) => {
  const booth = event.target instanceof Element ? event.target.closest(".citi-booth") : null;

  if (!booth || (event.key !== "Enter" && event.key !== " ")) {
    return;
  }

  event.preventDefault();
  openCitiShop(booth.dataset.citiShop);
});

els.citiShopClose.addEventListener("click", closeCitiShop);

document.addEventListener("keydown", (event) => {
  if (!document.querySelector("#app").classList.contains("citi-open")) {
    return;
  }

  if (event.target instanceof Element && event.target.closest(".citi-shop-panel")) {
    return;
  }

  if (event.key === "Escape" && els.citiShopPanel.classList.contains("open")) {
    closeCitiShop();
    return;
  }

  const speed = event.shiftKey ? 28 : 18;
  const moves = {
    ArrowUp: [0, -speed],
    w: [0, -speed],
    W: [0, -speed],
    ArrowDown: [0, speed],
    s: [0, speed],
    S: [0, speed],
    ArrowLeft: [-speed, 0],
    a: [-speed, 0],
    A: [-speed, 0],
    ArrowRight: [speed, 0],
    d: [speed, 0],
    D: [speed, 0],
  };
  const move = moves[event.key];

  if (!move) {
    return;
  }

  event.preventDefault();
  moveCitiPlayer(move[0], move[1]);
});

els.musicToggle.addEventListener("click", toggleBackgroundMusic);

els.enterShopButton.addEventListener("click", () => {
  if (!hasRebirthUnlocks()) {
    els.combo.textContent = "Rebirth once to unlock Kittey Goods";
    return;
  }

  els.shopScreen.classList.add("open");
  els.combo.textContent = "welcome to kitteys shop";
});

els.closeShopButton.addEventListener("click", () => {
  els.shopScreen.classList.remove("open");
});

els.exchangeTunaButton.addEventListener("click", () => {
  if (!hasRebirthUnlocks()) {
    els.combo.textContent = "Rebirth once to unlock tuna";
    return;
  }

  const exchangeableClicks = state.clicks - state.exchangedTunaClicks;

  if (exchangeableClicks < 10) {
    return;
  }

  const batches = Math.floor(exchangeableClicks / 10);
  const cans = batches + state.tunaExchangeBonus + state.tunaMagnetLevel;
  state.exchangedTunaClicks += batches * 10;
  state.tunaCans += cans;
  els.combo.textContent = `Exchanged for ${cans.toLocaleString("en-US")} tuna can${cans === 1 ? "" : "s"}`;
  showExchangeBubble();
  render();
  saveGame();
});

els.rebirthButton.addEventListener("click", rebirth);

function spendTuna(cost, onBuy) {
  const price = getPrice(cost);

  if (!hasRebirthUnlocks()) {
    els.combo.textContent = "Rebirth once to unlock Kittey Goods";
    return;
  }

  if (state.tunaCans < price) {
    return;
  }

  state.tunaCans -= price;
  onBuy();
  render();
  saveGame();
}

els.yarnButton.addEventListener("click", () => {
  spendTuna(1, () => {
    const payout = getPerClick() * 10;
    state.money += payout;
    els.combo.textContent = `Yarn Ball made ${formatMoney(payout)}`;
  });
});

els.fishButton.addEventListener("click", () => {
  spendTuna(3, () => {
    const payout = getPerClick() * 25;
    state.money += payout;
    els.combo.textContent = `Fish Snack made ${formatMoney(payout)}`;
  });
});

els.bellButton.addEventListener("click", () => {
  spendTuna(8, () => {
    state.luckyBells += 1;
    els.combo.textContent = `Lucky Bell added +0.1x`;
  });
});

els.couponButton.addEventListener("click", () => {
  spendTuna(5, () => {
    state.multiplierCost = Math.max(1, Math.floor(state.multiplierCost * 0.9));
    els.combo.textContent = "Coupon Stack clipped the multiplier price";
  });
});

function buyOrEquipLarry() {
  if (state.hasLarryCat) {
    setEquippedCat("larry");
    return;
  }

  const cost = getPrice(state.larryCatCost);

  if (state.hasLarryCat || state.clicks < cost) {
    return;
  }

  state.clicks -= cost;
  state.multiplier *= 100;
  state.hasLarryCat = true;
  state.larryMultiplierApplied = 100;
  state.equippedCat = "larry";
  startBackgroundMusic("larry");
  els.combo.textContent = `Evil Larry awakens. Multiplier is now x${state.multiplier.toLocaleString("en-US", {
    maximumFractionDigits: 2,
  })}`;
  render();
  saveGame();
}

els.larryShopButton.addEventListener("click", buyOrEquipLarry);

function buyOrEquipWetty() {
  if (state.hasWettyCat) {
    setEquippedCat("wetty");
    return;
  }

  const cost = getPrice(state.wettyCatCost);

  if (state.hasWettyCat || state.clicks < cost) {
    return;
  }

  state.clicks -= cost;
  state.multiplier *= 15;
  state.hasWettyCat = true;
  state.equippedCat = "wetty";
  startBackgroundMusic("wetty");
  els.combo.textContent = `Wetty drips in. Multiplier is now x${state.multiplier.toLocaleString("en-US", {
    maximumFractionDigits: 2,
  })}`;
  render();
  saveGame();
}

els.wettyShopButton.addEventListener("click", buyOrEquipWetty);

els.multiplierButton.addEventListener("click", () => {
  if (state.multiplierLevel >= multiplierMaxLevel) {
    els.combo.textContent = `Multiplier is capped at level ${multiplierMaxLevel}`;
    render();
    return;
  }

  buyUpgrade(
    "multiplierCost",
    () => {
      state.multiplier *= 2;
      state.multiplierLevel += 1;
      els.combo.textContent = `Multiplier level ${state.multiplierLevel}/${multiplierMaxLevel}`;
    },
    (cost) => Math.ceil(cost * 2.35),
  );
});

els.treatButton.addEventListener("click", () => {
  buyUpgrade(
    "treatCost",
    () => {
      state.boostEndsAt = Date.now() + 30000;
      els.combo.textContent = "Fancy treats active for 30 seconds";
    },
    (cost) => Math.ceil(cost * 1.35),
  );
});

els.catUpgradeButton.addEventListener("click", () => {
  if (state.hasPremiumCat) {
    setEquippedCat("premium");
    return;
  }

  const cost = getPrice(state.catUpgradeCost);

  if (state.hasPremiumCat || state.money < cost) {
    return;
  }

  state.money -= cost;
  state.multiplier *= 1.5;
  state.hasPremiumCat = true;
  state.equippedCat = "premium";
  startBackgroundMusic("premium");
  els.combo.textContent = `Premium cat adopted. Multiplier is now x${state.multiplier.toLocaleString("en-US", {
    maximumFractionDigits: 2,
  })}`;
  render();
  saveGame();
});

els.goldenCatButton.addEventListener("click", () => {
  if (state.hasGoldenCat) {
    setEquippedCat("golden");
    return;
  }

  const cost = getPrice(state.goldenCatCost);

  if (state.hasGoldenCat || state.money < cost) {
    return;
  }

  state.money -= cost;
  state.multiplier *= 5;
  state.hasGoldenCat = true;
  state.equippedCat = "golden";
  startBackgroundMusic("golden");
  els.combo.textContent = `Golden cat unlocked. Multiplier is now x${state.multiplier.toLocaleString("en-US", {
    maximumFractionDigits: 2,
  })}`;
  render();
  saveGame();
});

els.emoCatButton.addEventListener("click", () => {
  if (state.hasEmoCat) {
    setEquippedCat("emo");
    return;
  }

  const cost = getPrice(state.emoCatCost);

  if (state.hasEmoCat || state.money < cost) {
    return;
  }

  state.money -= cost;
  state.multiplier *= 3.5;
  state.hasEmoCat = true;
  state.equippedCat = "emo";
  startBackgroundMusic("emo");
  els.combo.textContent = `Emo Y2K cat unlocked. Multiplier is now x${state.multiplier.toLocaleString("en-US", {
    maximumFractionDigits: 2,
  })}`;
  render();
  saveGame();
});

els.warCatButton.addEventListener("click", () => {
  if (state.hasWarCat) {
    setEquippedCat("war");
    return;
  }

  const cost = getPrice(state.warCatCost);

  if (state.hasWarCat || state.money < cost) {
    return;
  }

  state.money -= cost;
  state.multiplier *= 10;
  state.hasWarCat = true;
  state.equippedCat = "war";
  startBackgroundMusic("war");
  els.combo.textContent = `War cat deployed. Multiplier is now x${state.multiplier.toLocaleString("en-US", {
    maximumFractionDigits: 2,
  })}`;
  render();
  saveGame();
});

els.larryCatButton.addEventListener("click", () => {
  buyOrEquipLarry();
});

els.wettyCatButton.addEventListener("click", () => {
  buyOrEquipWetty();
});

els.glungusCatButton.addEventListener("click", () => {
  if (state.hasGlungusCat) {
    setEquippedCat("glungus");
    return;
  }

  const cost = getPrice(state.glungusCatCost);

  if (state.money < cost) {
    return;
  }

  state.money -= cost;
  state.multiplier *= 22.5;
  state.hasGlungusCat = true;
  state.equippedCat = "glungus";
  startBackgroundMusic("glungus");
  els.combo.textContent = `Glungus arrives. Multiplier is now x${state.multiplier.toLocaleString("en-US", {
    maximumFractionDigits: 2,
  })}`;
  render();
  saveGame();
});

els.glorbzorgCatButton.addEventListener("click", () => {
  if (state.hasGlorbzorgCat) {
    setEquippedCat("glorbzorg");
    return;
  }

  const cost = getPrice(state.glorbzorgCatCost);

  if (state.money < cost) {
    return;
  }

  state.money -= cost;
  state.multiplier *= 50;
  state.hasGlorbzorgCat = true;
  state.glorbzorgMultiplierApplied = 50;
  state.equippedCat = "glorbzorg";
  startBackgroundMusic("glorbzorg");
  els.combo.textContent = `Glorbzorg has entered the atmosphere. Multiplier is now x${state.multiplier.toLocaleString(
    "en-US",
    { maximumFractionDigits: 2 },
  )}`;
  render();
  saveGame();
});

els.soggyCatButton.addEventListener("click", () => {
  if (state.hasSoggyCat) {
    setEquippedCat("soggy");
    return;
  }

  const cost = getPrice(state.soggyCatCost);

  if (state.money < cost) {
    return;
  }

  state.money -= cost;
  state.multiplier *= 75;
  state.hasSoggyCat = true;
  state.equippedCat = "soggy";
  startBackgroundMusic("soggy");
  els.combo.textContent = `Soggy emerges. Multiplier is now x${state.multiplier.toLocaleString("en-US", {
    maximumFractionDigits: 2,
  })}`;
  render();
  saveGame();
});

els.resetButton.addEventListener("click", resetGame);

loadGame();
render();
setMusicTheme(getActiveMusicCat());
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}
window.setInterval(passiveTick, 1000);
window.setInterval(render, 250);

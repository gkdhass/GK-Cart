/**
 * @file server/seed/generateProducts.js
 * @description Programmatic product generator for K_M_Cart seed data.
 * Generates 500 unique products across all categories with realistic data.
 */

// ─── IMAGE URLS (unique per category — round-robin assigned) ────────
const IMAGES = {
  mobile: [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400',
    'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400',
    'https://images.unsplash.com/photo-1621330396173-e41b1cafd17f?w=400',
    'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400',
    'https://images.unsplash.com/photo-1580910051074-3eb694886571?w=400',
    'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=400',
    'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400',
    'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400',
    'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=400',
    'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=400',
    'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=400',
    'https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=400',
    'https://images.unsplash.com/photo-1570101945621-945409a6370f?w=400',
    'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=400',
    'https://images.unsplash.com/photo-1603891128711-11b4b03bb138?w=400',
    'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400',
    'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=400',
    'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400',
    'https://images.unsplash.com/photo-1533228100845-08145b01de14?w=400',
    'https://images.unsplash.com/photo-1583573636246-18cb2246697f?w=400',
    'https://images.unsplash.com/photo-1609692814857-d4f3e96f6395?w=400',
    'https://images.unsplash.com/photo-1581795669633-91ef7c9699a8?w=400',
    'https://images.unsplash.com/photo-1617625802912-cde586faf331?w=400',
    'https://images.unsplash.com/photo-1596558450268-9c27524ba856?w=400',
    'https://images.unsplash.com/photo-1560343776-97e7d202ff0e?w=400',
    'https://images.unsplash.com/photo-1571380401583-72ca84697209?w=400',
    'https://images.unsplash.com/photo-1544866092-1935c5ef2a8f?w=400',
    'https://images.unsplash.com/photo-1595941069915-4ebc5197c14a?w=400',
  ],
  laptop: [
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400',
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400',
    'https://images.unsplash.com/photo-1504707748692-419802cf939d?w=400',
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400',
    'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400',
    'https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=400',
    'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400',
    'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=400',
    'https://images.unsplash.com/photo-1602080858428-57174f9431cf?w=400',
    'https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?w=400',
    'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=400',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400',
    'https://images.unsplash.com/photo-1544731612-de7f96afe55f?w=400',
    'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=400',
    'https://images.unsplash.com/photo-1580522154071-c6ca47a859ad?w=400',
    'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400',
    'https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?w=400',
    'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=400',
    'https://images.unsplash.com/photo-1598986646512-9330bef10cb6?w=400',
    'https://images.unsplash.com/photo-1575024357670-2b5164f470c3?w=400',
  ],
  speaker: [
    'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400',
    'https://images.unsplash.com/photo-1507646227500-4d389b0012be?w=400',
    'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=400',
    'https://images.unsplash.com/photo-1543512214-318c7553f230?w=400',
    'https://images.unsplash.com/photo-1564424224827-cd24b8915874?w=400',
    'https://images.unsplash.com/photo-1596455607563-ad6193f4d0aa?w=400',
    'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400',
    'https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=400',
    'https://images.unsplash.com/photo-1559336197-ded8aaa244bc?w=400',
    'https://images.unsplash.com/photo-1585678086783-5ab53017de49?w=400',
    'https://images.unsplash.com/photo-1612198188061-be95b6a37575?w=400',
    'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400',
    'https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=400',
    'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=400',
    'https://images.unsplash.com/photo-1481207727306-bccce8e0c2d3?w=400',
    'https://images.unsplash.com/photo-1531104985437-603d6490e6d8?w=400',
    'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=400',
    'https://images.unsplash.com/photo-1587389882906-2cf35a78e4c3?w=400',
    'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=400',
    'https://images.unsplash.com/photo-1548921441-89c8bd0d5765?w=400',
    'https://images.unsplash.com/photo-1462965326201-d02e4f455804?w=400',
    'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=400',
    'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400',
  ],
  headphone: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400',
    'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=400',
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400',
    'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=400',
    'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=400',
    'https://images.unsplash.com/photo-1558756520-22cfe5d382ca?w=400',
    'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400',
    'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400',
    'https://images.unsplash.com/photo-1577174881658-0f30ed549adc?w=400',
    'https://images.unsplash.com/photo-1599669454699-248893623440?w=400',
    'https://images.unsplash.com/photo-1612444530582-fc66f7b7ce8a?w=400',
    'https://images.unsplash.com/photo-1614860930437-3bc0c0b6d21e?w=400',
    'https://images.unsplash.com/photo-1585298723682-7115561c51b7?w=400',
    'https://images.unsplash.com/photo-1583843424390-e19b75a32e34?w=400',
    'https://images.unsplash.com/photo-1590658165737-15a047b7c0b0?w=400',
    'https://images.unsplash.com/photo-1569937756447-1d44f657dc69?w=400',
    'https://images.unsplash.com/photo-1591105577850-fb282a00005a?w=400',
    'https://images.unsplash.com/photo-1570993492903-ba8a0d1b8f8e?w=400',
    'https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=400',
    'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400',
    'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400',
    'https://images.unsplash.com/photo-1593121925328-369cc8459c08?w=400',
    'https://images.unsplash.com/photo-1548921441-89c8bd0d5765?w=400',
  ],
  shirt: [
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400',
    'https://images.unsplash.com/photo-1594938298603-c8148c4b4993?w=400',
    'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=400',
    'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400',
    'https://images.unsplash.com/photo-1588359348347-9bc6cbbb689e?w=400',
    'https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?w=400',
    'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=400',
    'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=400',
    'https://images.unsplash.com/photo-1598033129183-c4f50c736c10?w=400',
    'https://images.unsplash.com/photo-1564859228273-274232fdb516?w=400',
    'https://images.unsplash.com/photo-1563389234808-a4e1c2e5f8f6?w=400',
    'https://images.unsplash.com/photo-1571455786673-9d9d6c194f90?w=400',
    'https://images.unsplash.com/photo-1618517351616-38fb9c5210c6?w=400',
    'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400',
    'https://images.unsplash.com/photo-1622445275576-721325763afe?w=400',
    'https://images.unsplash.com/photo-1608234807905-4466023792f5?w=400',
    'https://images.unsplash.com/photo-1626497764746-6dc36546b388?w=400',
    'https://images.unsplash.com/photo-1594938328870-9623159c8c99?w=400',
    'https://images.unsplash.com/photo-1560343776-97e7d202ff0e?w=400',
    'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400',
  ],
  pants: [
    'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400',
    'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=400',
    'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400',
    'https://images.unsplash.com/photo-1584865288642-42078afe6942?w=400',
    'https://images.unsplash.com/photo-1475178626620-a4d074967571?w=400',
    'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=400',
    'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=400',
    'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400',
    'https://images.unsplash.com/photo-1560343776-97e7d202ff0e?w=400',
    'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400',
    'https://images.unsplash.com/photo-1519235624215-85175d5eb36e?w=400',
    'https://images.unsplash.com/photo-1548883354-94bcfe321cbb?w=400',
    'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400',
    'https://images.unsplash.com/photo-1602293589930-45aad59ba3ab?w=400',
    'https://images.unsplash.com/photo-1609535766689-e068b15fbf2c?w=400',
    'https://images.unsplash.com/photo-1613694572637-c0baf6d7b2c9?w=400',
    'https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=400',
    'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=400',
    'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=400',
    'https://images.unsplash.com/photo-1560243563-062bfc001d68?w=400',
  ],
  kids: [
    'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=400',
    'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=400',
    'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400',
    'https://images.unsplash.com/photo-1543854589-fdd4d3a0d181?w=400',
    'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400',
    'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400',
    'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=400',
    'https://images.unsplash.com/photo-1607453998774-d533f65dac99?w=400',
    'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?w=400',
    'https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=400',
    'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=400',
    'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=400',
    'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400',
    'https://images.unsplash.com/photo-1596436889106-be35e843f974?w=400',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400',
    'https://images.unsplash.com/photo-1611432026032-61e5e1e4b89e?w=400',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400',
    'https://images.unsplash.com/photo-1495482108010-8a58da3ada7b?w=400',
    'https://images.unsplash.com/photo-1604467707321-70d009801bf9?w=400',
    'https://images.unsplash.com/photo-1590750783122-c4e638c1f7a7?w=400',
    'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400',
    'https://images.unsplash.com/photo-1560506840-ec148e82a604?w=400',
    'https://images.unsplash.com/photo-1518643561450-e6adaa1e0df7?w=400',
    'https://images.unsplash.com/photo-1580477667995-2b94f01c9516?w=400',
    'https://images.unsplash.com/photo-1571210862729-78a33e9c632d?w=400',
  ],
  girls: [
    'https://images.unsplash.com/photo-1476234251651-f353703a034d?w=400',
    'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400',
    'https://images.unsplash.com/photo-1611432026032-61e5e1e4b89e?w=400',
    'https://images.unsplash.com/photo-1543854589-fdd4d3a0d181?w=400',
    'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?w=400',
    'https://images.unsplash.com/photo-1596436889106-be35e843f974?w=400',
    'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400',
    'https://images.unsplash.com/photo-1560506840-ec148e82a604?w=400',
    'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400',
    'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=400',
    'https://images.unsplash.com/photo-1607453998774-d533f65dac99?w=400',
    'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=400',
    'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400',
    'https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=400',
    'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400',
    'https://images.unsplash.com/photo-1590750783122-c4e638c1f7a7?w=400',
    'https://images.unsplash.com/photo-1580477667995-2b94f01c9516?w=400',
    'https://images.unsplash.com/photo-1571210862729-78a33e9c632d?w=400',
    'https://images.unsplash.com/photo-1518643561450-e6adaa1e0df7?w=400',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400',
    'https://images.unsplash.com/photo-1604467707321-70d009801bf9?w=400',
    'https://images.unsplash.com/photo-1495482108010-8a58da3ada7b?w=400',
    'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=400',
    'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=400',
  ],
  watch: [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=400',
    'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=400',
    'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400',
    'https://images.unsplash.com/photo-1539874754764-5a96559165b0?w=400',
    'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=400',
    'https://images.unsplash.com/photo-1548169874-53e85f753f1e?w=400',
    'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=400',
    'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=400',
    'https://images.unsplash.com/photo-1518131672697-613becd4fab5?w=400',
    'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=400',
    'https://images.unsplash.com/photo-1557531365-e8b22d93dbd0?w=400',
    'https://images.unsplash.com/photo-1526045431048-f857369baa09?w=400',
    'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=400',
    'https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=400',
    'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400',
    'https://images.unsplash.com/photo-1617043786394-f977fa12eddf?w=400',
    'https://images.unsplash.com/photo-1585123334904-845d60e97b29?w=400',
    'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=400',
    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400',
    'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=400',
    'https://images.unsplash.com/photo-1619134778706-7015533a6150?w=400',
    'https://images.unsplash.com/photo-1455287278107-115faab3eafa?w=400',
    'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?w=400',
    'https://images.unsplash.com/photo-1623998022290-a74f8cc36563?w=400',
  ],
};

// ─── ROUND-ROBIN IMAGE COUNTERS (ensures unique images per category) ─
const _imageCounters = {};
/** Pick the next image in sequence for a category — no two adjacent products share an image */
const pickImage = (key) => {
  if (!_imageCounters[key]) _imageCounters[key] = 0;
  const arr = IMAGES[key];
  const img = arr[_imageCounters[key] % arr.length];
  _imageCounters[key]++;
  return img;
};

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randF = (min, max, dec = 1) => +(Math.random() * (max - min) + min).toFixed(dec);

// ─── MOBILE PHONES (30) ────────────────────────────────────────────
function generateMobiles() {
  const phones = [
    { brand: 'Samsung', models: ['Galaxy S24 Ultra','Galaxy S24+','Galaxy S23 FE','Galaxy A55 5G','Galaxy A35 5G','Galaxy M55','Galaxy F15 5G','Galaxy A15'] },
    { brand: 'Apple', models: ['iPhone 15 Pro Max','iPhone 15 Pro','iPhone 15','iPhone 14','iPhone SE 2024'] },
    { brand: 'OnePlus', models: ['OnePlus 12','OnePlus 12R','OnePlus Nord CE4','OnePlus Nord 3'] },
    { brand: 'Xiaomi', models: ['Xiaomi 14 Pro','Xiaomi 14','Redmi Note 13 Pro+','Redmi Note 13','Redmi 13C'] },
    { brand: 'Realme', models: ['Realme GT 6','Realme Narzo 70 Pro','Realme 12 Pro+','Realme C67'] },
    { brand: 'Vivo', models: ['Vivo X100 Pro','Vivo V30'] },
    { brand: 'OPPO', models: ['OPPO Reno 12 Pro','OPPO A79 5G'] },
  ];
  const rams = ['6GB','8GB','12GB','16GB'];
  const storages = ['128GB','256GB','512GB'];
  const cameras = ['50MP','64MP','108MP','200MP'];
  const batteries = ['4500mAh','5000mAh','5500mAh'];
  const processors = ['Snapdragon 8 Gen 3','Snapdragon 7s Gen 2','Dimensity 9200+','Dimensity 7050','A17 Pro','A16 Bionic','Exynos 2400'];
  const colorSets = [['Titanium Black','Silver','Violet'],['Phantom Black','Cream','Green'],['Midnight','Starlight','Blue'],['Obsidian Black','Pearl White','Sage Green']];
  const products = [];
  phones.forEach(({ brand, models }) => {
    models.forEach((model) => {
      const isApple = brand === 'Apple';
      const price = isApple ? rand(49900, 159900) : rand(8999, 89999);
      const disc = rand(5, 25);
      const orig = Math.round(price / (1 - disc / 100));
      products.push({
        name: `${brand} ${model}`,
        description: `${pick(rams)} RAM, ${pick(storages)} storage, ${pick(cameras)} camera, ${pick(batteries)} battery, ${pick(processors)} processor. Premium ${isApple?'iOS':'Android'} smartphone with 5G connectivity.`,
        price, originalPrice: orig, discount: disc, category: 'mobile',
        image: pickImage('mobile'), stock: rand(10, 200),
        rating: randF(3.8, 4.9), reviewCount: rand(120, 8500),
        brand, tags: ['smartphone', isApple ? 'ios' : 'android', brand.toLowerCase(), '5g'],
        sizes: ['One Size'], colors: pick(colorSets), gender: 'all', reviews: [],
      });
    });
  });
  return products;
}

// ─── LAPTOPS (20) ──────────────────────────────────────────────────
function generateLaptops() {
  const laptops = [
    { brand:'HP', models:['Pavilion 15','Victus 16 Gaming','Envy x360 14','Spectre x360 16','HP 15s'] },
    { brand:'Dell', models:['XPS 15','Inspiron 16','Latitude 5540','G16 Gaming','Vostro 3420'] },
    { brand:'Lenovo', models:['IdeaPad Slim 5','ThinkPad E16','Legion 5i Pro','Yoga Slim 7'] },
    { brand:'Apple', models:['MacBook Air M3','MacBook Pro 14 M3','MacBook Pro 16 M3 Max'] },
    { brand:'ASUS', models:['ROG Strix G16','VivoBook 15','ZenBook 14 OLED'] },
  ];
  const cpus = ['Intel i5-13500H','Intel i7-13700H','Intel i9-13900HX','AMD Ryzen 5 7535U','AMD Ryzen 7 7730U','Apple M3','Apple M3 Pro'];
  const ramOpts = ['8GB DDR5','16GB DDR5','32GB DDR5'];
  const ssdOpts = ['256GB SSD','512GB SSD','1TB SSD'];
  const displays = ['14" FHD IPS','15.6" FHD IPS','16" QHD+ IPS','14" 2.8K OLED','15.6" 3.5K OLED'];
  const useTags = ['work','gaming','office','student','creative'];
  const products = [];
  laptops.forEach(({ brand, models }) => {
    models.forEach((model) => {
      const price = rand(35000, 200000);
      const disc = rand(5, 20);
      products.push({
        name: `${brand} ${model}`,
        description: `${pick(cpus)} processor, ${pick(ramOpts)} RAM, ${pick(ssdOpts)} storage, ${pick(displays)} display. Up to 12hr battery life.`,
        price, originalPrice: Math.round(price / (1 - disc / 100)), discount: disc, category: 'laptop',
        image: pickImage('laptop'), stock: rand(5, 80),
        rating: randF(3.9, 4.9), reviewCount: rand(80, 5000),
        brand, tags: ['laptop', 'computer', brand.toLowerCase(), pick(useTags)],
        sizes: ['One Size'], colors: ['Silver','Black','Space Grey'].slice(0, rand(2,3)), gender: 'all', reviews: [],
      });
    });
  });
  return products;
}

// ─── BLUETOOTH SPEAKERS (50) ───────────────────────────────────────
function generateSpeakers() {
  const brands = [
    { brand:'JBL', pfx:['Flip 6','Charge 5','Go 3','Xtreme 3','Clip 4','PartyBox 110','Pulse 5','Flip 5','Go Essential','Tune 510','Wind 3','Bar 5.0','Boombox 3','Endurance Peak','Charge 4'] },
    { brand:'boAt', pfx:['Stone 1200','Stone 350','Aavante Bar 1160','Stone 190','Stone 650','Airdopes 141','Stone 180','Stone 500','Stone 1400','Aavante Bar 610','Stone 352','Stone 170','Stone 700','Airdopes 131','Stone 250'] },
    { brand:'Sony', pfx:['SRS-XB100','SRS-XB13','SRS-XG300','SRS-XE200','SRS-XB43','SRS-XG500','SRS-XB23','SRS-XP500','SRS-XV800','ULT Field 1'] },
    { brand:'Bose', pfx:['SoundLink Flex','SoundLink Micro','SoundLink Revolve+','Portable Home','SoundLink Mini II'] },
    { brand:'Noise', pfx:['Vibe','Explorer','Zest','Symphony','Pulse'] },
  ];
  const features = ['IPX7 waterproof, 12hr playback, deep bass','20W output, TWS pairing, USB-C charging','Portable design, built-in mic, AUX input','Party mode, LED lights, 24hr battery','Premium sound, compact design, 10hr battery'];
  const colorSets = ['Black','Blue','Red','Grey','Green','Teal','Orange','Camo'];
  const products = [];
  brands.forEach(({ brand, pfx }) => {
    pfx.forEach((model) => {
      const price = rand(800, 30000);
      const disc = rand(5, 35);
      products.push({
        name: `${brand} ${model}`,
        description: `${pick(features)}. Bluetooth 5.3 wireless speaker by ${brand}.`,
        price, originalPrice: Math.round(price / (1 - disc / 100)), discount: disc, category: 'bluetooth-speakers',
        image: pickImage('speaker'), stock: rand(15, 200),
        rating: randF(3.6, 4.8), reviewCount: rand(200, 12000),
        brand, tags: ['bluetooth', 'speaker', 'wireless', 'music', brand.toLowerCase()],
        sizes: ['One Size'], colors: [pick(colorSets), pick(colorSets), pick(colorSets)].filter((v,i,a) => a.indexOf(v) === i),
        gender: 'all', reviews: [],
      });
    });
  });
  return products;
}

// ─── WIRED HEADPHONES (50) ─────────────────────────────────────────
function generateHeadphones() {
  const brands = [
    { brand:'boAt', pfx:['Rockerz 450','BassHeads 100','BassHeads 225','Rockerz 510','Rockerz 400','BassHeads 162','Immortal 1000D','Rockerz 550','BassHeads 242','Rockerz 370','BassHeads 152','BassHeads 182','Nirvanaa 715','Rockerz 255','BassHeads 900'] },
    { brand:'Sony', pfx:['MDR-ZX110','WH-CH520','MDR-EX150','MDR-XB55','WH-1000XM5','MDR-ZX310','MDR-EX155','WH-CH720N','MDR-7506','IER-M7','MDR-EX14','WH-XB910N'] },
    { brand:'JBL', pfx:['Tune 510BT','Tune 710BT','C100SI','T110','Quantum 100','Endurance Run','Tune 230NC','Live 660NC','Quantum 300','C150SI'] },
    { brand:'Sennheiser', pfx:['HD 599','HD 400S','CX 80S','HD 560S','CX 300S','IE 100 Pro','HD 450BT','Momentum 4'] },
    { brand:'Audio-Technica', pfx:['ATH-M50x','ATH-M20x','ATH-M40x','ATH-CKR30iS','ATH-S100'] },
  ];
  const features = ['40mm drivers, deep bass, foldable design','Hi-Res audio, noise isolation, tangle-free cable','Studio-quality sound, padded ear cups, detachable cable','In-ear ergonomic fit, inline mic, 3.5mm jack','Over-ear comfort, adjustable headband, rich audio'];
  const products = [];
  brands.forEach(({ brand, pfx }) => {
    pfx.forEach((model) => {
      const price = rand(500, 25000);
      const disc = rand(5, 30);
      products.push({
        name: `${brand} ${model}`,
        description: `${pick(features)}. Premium audio by ${brand}.`,
        price, originalPrice: Math.round(price / (1 - disc / 100)), discount: disc, category: 'wired-headphones',
        image: pickImage('headphone'), stock: rand(20, 300),
        rating: randF(3.5, 4.8), reviewCount: rand(150, 15000),
        brand, tags: ['headphones', 'wired', 'audio', 'music', brand.toLowerCase()],
        sizes: ['One Size'], colors: ['Black','White','Red','Blue'].slice(0, rand(2,4)),
        gender: 'all', reviews: [],
      });
    });
  });
  return products;
}

// ─── MEN'S SHIRTS (40) ────────────────────────────────────────────
function generateMenShirts() {
  const types = [
    { type:'Formal Plain', adj:['Classic','Premium','Executive','Elite','Signature'], colors:[['White','Sky Blue','Light Pink'],['Ivory','Silver Grey','Lavender'],['French Blue','Mint'],['Cream','Pearl White']] },
    { type:'Casual Check', adj:['Trendy','Urban','Weekend','Smart','Heritage'], colors:[['Navy Check','Red Check','Green Check'],['Blue Plaid','Grey Plaid'],['Maroon Check','Olive Check']] },
    { type:'Polo', adj:['Classic','Sport','Pro','Active','Essential'], colors:[['Navy','White','Black','Red'],['Olive Green','Mustard','Teal'],['Burgundy','Charcoal']] },
    { type:'Linen', adj:['Breezy','Natural','Resort','Summer','Coastal'], colors:[['White','Beige','Sky Blue'],['Sage Green','Sand'],['Light Grey','Blush']] },
    { type:'Printed', adj:['Trendy','Artistic','Bold','Modern','Abstract'], colors:[['Floral Blue','Geometric Black'],['Tropical Print','Abstract Navy'],['Paisley Maroon','Dotted Grey']] },
  ];
  const brands = ['Allen Solly','Peter England','Van Heusen','Wrangler','H&M'];
  const fits = ['slim fit','regular fit','tailored fit'];
  const fabrics = ['100% cotton','cotton-poly blend','premium linen','oxford cotton','poplin'];
  const products = [];
  let count = 0;
  const targets = [10, 10, 10, 5, 5];
  types.forEach(({ type, adj, colors }, ti) => {
    for (let i = 0; i < targets[ti]; i++) {
      const brand = brands[count % brands.length];
      const price = rand(499, 3999);
      const disc = rand(10, 40);
      products.push({
        name: `${brand} Men's ${pick(adj)} ${type} Shirt`,
        description: `${pick(fabrics)}, ${pick(fits)}, perfect for ${type.includes('Formal')?'office':'everyday'} wear. Breathable and comfortable. Available in multiple sizes.`,
        price, originalPrice: Math.round(price / (1 - disc / 100)), discount: disc, category: 'men-shirts',
        image: pickImage('shirt'), stock: rand(30, 150),
        rating: randF(3.8, 4.7), reviewCount: rand(100, 3000),
        brand, tags: ['shirt', 'men', type.toLowerCase().includes('formal') ? 'formal' : 'casual', brand.toLowerCase()],
        sizes: ['S','M','L','XL','XXL'], colors: pick(colors), gender: 'men', reviews: [],
      });
      count++;
    }
  });
  return products;
}

// ─── MEN'S PANTS (20) ─────────────────────────────────────────────
function generateMenPants() {
  const brands = ["Levi's","Wrangler","Allen Solly","Peter England"];
  const types = [
    { type:'Formal Trouser', count:8, desc:'Flat-front formal trousers, wrinkle-free, perfect crease' },
    { type:'Slim Fit Jeans', count:7, desc:'Stretchable denim, 5-pocket design, mid-rise fit' },
    { type:'Chinos', count:5, desc:'Cotton chinos, tapered leg, easy care, versatile casual wear' },
  ];
  const colorSets = [['Black','Navy Blue','Dark Grey','Charcoal'],['Khaki','Brown','Olive','Beige'],['Medium Wash','Dark Wash','Light Blue','Black Denim']];
  const products = [];
  let idx = 0;
  types.forEach(({ type, count, desc }) => {
    for (let i = 0; i < count; i++) {
      const brand = brands[idx % brands.length];
      const price = rand(799, 4999);
      const disc = rand(10, 35);
      const tag = type.includes('Jeans') ? 'jeans' : type.includes('Chinos') ? 'chinos' : 'formal';
      products.push({
        name: `${brand} Men's ${type} ${['Classic','Premium','Comfort','Flex','Essential'][i % 5]}`,
        description: `${desc}. By ${brand}. Available in multiple sizes and colors.`,
        price, originalPrice: Math.round(price / (1 - disc / 100)), discount: disc, category: 'men-pants',
        image: pickImage('pants'), stock: rand(25, 120),
        rating: randF(3.8, 4.6), reviewCount: rand(80, 2500),
        brand, tags: ['pants', 'trousers', 'men', tag, brand.toLowerCase()],
        sizes: ['28','30','32','34','36','38'], colors: pick(colorSets).slice(0, rand(2,4)), gender: 'men', reviews: [],
      });
      idx++;
    }
  });
  return products;
}

// ─── KIDS DRESSES (100) ────────────────────────────────────────────
function generateKidsDresses() {
  const brands = ['H&M Kids','Zara Kids','FirstCry','Mothercare','Max Fashion'];
  const types = [
    { type:'T-shirt & Shorts Set', count:25 },
    { type:'Dungaree', count:20 },
    { type:'Frock', count:20 },
    { type:'Ethnic Kurta Set', count:15 },
    { type:'School Uniform Set', count:10 },
    { type:'Party Wear', count:10 },
  ];
  const adjs = ['Adorable','Playful','Cheerful','Cute','Happy','Sunshine','Little Star','Rainbow','Dreamy','Sparkle','Cozy','Fun','Jolly','Breezy','Sweet'];
  const colors = [['Red','Blue','Yellow'],['Pink','White','Green'],['Navy','Orange','Teal'],['Multicolor','Purple','Coral'],['Sky Blue','Mint','Lemon']];
  const products = [];
  let idx = 0;
  types.forEach(({ type, count }) => {
    for (let i = 0; i < count; i++) {
      const brand = brands[idx % brands.length];
      const price = rand(299, 1999);
      const disc = rand(10, 45);
      const tag = type.includes('Party') ? 'party' : type.includes('School') ? 'school' : 'casual';
      products.push({
        name: `${brand} ${pick(adjs)} Kids ${type}`,
        description: `Comfortable ${type.toLowerCase()} for kids, soft fabric, age-appropriate design. Machine washable. By ${brand}.`,
        price, originalPrice: Math.round(price / (1 - disc / 100)), discount: disc, category: 'kids-dress',
        image: pickImage('kids'), stock: rand(30, 200),
        rating: randF(3.8, 4.8), reviewCount: rand(50, 2000),
        brand, tags: ['kids', 'children', 'dress', brand.toLowerCase(), tag],
        sizes: ['1-2Y','2-3Y','3-4Y','4-5Y','5-6Y','6-8Y','8-10Y','10-12Y'], colors: pick(colors), gender: 'kids', reviews: [],
      });
      idx++;
    }
  });
  return products;
}

// ─── GIRLS DRESSES (100) ──────────────────────────────────────────
function generateGirlsDresses() {
  const brands = ['Zara Kids','H&M','Marks & Spencer','Pantaloons','Myntra'];
  const types = [
    { type:'A-Line Frock', count:25 },
    { type:'Lehenga Set', count:20 },
    { type:'Western Casual Dress', count:20 },
    { type:'Party Gown', count:15 },
    { type:'Top & Skirt Set', count:10 },
    { type:'Jumpsuit', count:10 },
  ];
  const adjs = ['Princess','Elegant','Charming','Graceful','Lovely','Fairy','Blossom','Angelic','Dazzling','Fancy','Radiant','Pretty','Delicate','Twinkle','Enchanting'];
  const colors = [['Pink','White','Lavender'],['Red','Gold','Magenta'],['Peach','Coral','Mint'],['Royal Blue','Silver','Rose'],['Yellow','Turquoise','Lilac']];
  const products = [];
  let idx = 0;
  types.forEach(({ type, count }) => {
    for (let i = 0; i < count; i++) {
      const brand = brands[idx % brands.length];
      const price = rand(399, 3499);
      const disc = rand(10, 40);
      const tag = type.includes('Party') || type.includes('Gown') ? 'party' : type.includes('Lehenga') ? 'ethnic' : 'casual';
      products.push({
        name: `${brand} ${pick(adjs)} Girls ${type}`,
        description: `Beautiful ${type.toLowerCase()} for girls, premium fabric, cute design details. Perfect for ${tag} occasions. By ${brand}.`,
        price, originalPrice: Math.round(price / (1 - disc / 100)), discount: disc, category: 'girls-dress',
        image: pickImage('girls'), stock: rand(20, 180),
        rating: randF(3.9, 4.8), reviewCount: rand(60, 2500),
        brand, tags: ['girls', 'dress', 'frock', brand.toLowerCase(), tag],
        sizes: ['3-4Y','4-5Y','5-6Y','6-8Y','8-10Y','10-12Y','12-14Y','14-16Y'], colors: pick(colors), gender: 'girls', reviews: [],
      });
      idx++;
    }
  });
  return products;
}

// ─── WATCHES (90) ──────────────────────────────────────────────────
function generateWatches() {
  const brands = [
    { brand:'Titan', count:20 }, { brand:'Fastrack', count:20 }, { brand:'Casio', count:15 },
    { brand:'Fossil', count:15 }, { brand:'boAt', count:10 }, { brand:'Noise', count:10 },
  ];
  const typesDist = [
    { type:'Analog', count:30, desc:'Classic analog dial, stainless steel case, leather/metal strap' },
    { type:'Digital', count:25, desc:'Digital display, stopwatch, alarm, backlight, water resistant' },
    { type:'Smartwatch', count:20, desc:'AMOLED display, SpO2, heart rate, GPS, Bluetooth calling' },
    { type:'Sports', count:15, desc:'Shock resistant, 100m water resistant, chronograph, rugged build' },
  ];
  const genders = ['men','men','men','men','women','women','women','unisex','unisex','unisex'];
  const colorSets = [['Silver','Black'],['Rose Gold','Gold'],['Blue','Brown'],['Black','Green'],['Silver','Rose Gold','Blue']];
  const collections = ['Classic','Edge','Bold','Neo','Retro','Urban','Elite','Pulse','Explorer','Nexus','Revolution','Heritage','Rush','Horizon','Velocity'];
  const products = [];
  let gIdx = 0;
  let tIdx = 0;
  brands.forEach(({ brand, count }) => {
    for (let i = 0; i < count; i++) {
      const typeInfo = typesDist[tIdx % typesDist.length];
      const gender = genders[gIdx % genders.length];
      const price = brand === 'boAt' || brand === 'Noise' ? rand(799, 5999) : rand(1299, 24999);
      const disc = rand(5, 30);
      products.push({
        name: `${brand} ${pick(collections)} ${typeInfo.type} Watch`,
        description: `${typeInfo.desc}. Premium ${brand} timepiece for ${gender}. Warranty included.`,
        price, originalPrice: Math.round(price / (1 - disc / 100)), discount: disc, category: 'watches',
        image: pickImage('watch'), stock: rand(15, 150),
        rating: randF(3.7, 4.8), reviewCount: rand(100, 6000),
        brand, tags: ['watch', 'timepiece', brand.toLowerCase(), typeInfo.type.toLowerCase(), gender],
        sizes: ['Free Size'], colors: pick(colorSets), gender, reviews: [],
      });
      gIdx++;
      tIdx++;
    }
  });
  return products;
}

// ─── MAIN EXPORT ───────────────────────────────────────────────────
function generateAllProducts() {
  return [
    ...generateMobiles(),
    ...generateLaptops(),
    ...generateSpeakers(),
    ...generateHeadphones(),
    ...generateMenShirts(),
    ...generateMenPants(),
    ...generateKidsDresses(),
    ...generateGirlsDresses(),
    ...generateWatches(),
  ];
}

module.exports = { generateAllProducts };

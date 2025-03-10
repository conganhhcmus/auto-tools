const DelayTime = 0.005 // 5 ms

const DefaultBasket = { x: 26.25, y: 56.67 }

const DefaultProduct = { x: 38.125, y: 41.11 }

const FirstRowSlotList = [
    { x: 36.875, y: 83.78 }, // 0
    { x: 41.375, y: 83.78 },
    { x: 45.875, y: 83.78 }, // 1
    { x: 50.1875, y: 83.78 },
    { x: 54.5, y: 83.78 }, // 2
    { x: 59.0625, y: 83.78 },
    { x: 63.625, y: 83.78 }, // 3
    { x: 68.0625, y: 83.78 },
    { x: 72.5, y: 83.78 }, // 4
    { x: 76.8125, y: 83.78 },
    { x: 81.125, y: 83.78 }, // 5
    { x: 84.0, y: 78.2 },
    { x: 84.0, y: 68.2 },
    { x: 84.0, y: 58.2 },
    { x: 84.0, y: 48.2 },
]

const SecondRowSlotList = [
    { x: 84.0, y: 40.0 },
    { x: 81.125, y: 37.78 }, // 0
    { x: 76.8125, y: 37.78 },
    { x: 72.5, y: 37.78 }, // 1
    { x: 68.0625, y: 37.78 },
    { x: 63.625, y: 37.78 }, // 2
    { x: 59.0625, y: 37.78 },
    { x: 54.5, y: 37.78 }, // 3
    { x: 50.1875, y: 37.78 },
    { x: 45.875, y: 37.78 }, // 4
    { x: 41.375, y: 37.78 },
    { x: 36.875, y: 37.78 }, // 5
    { x: 30.1, y: 40.0 },
]

const PlantSlotList = [
    //[0, 1, 2]
    //[3, 4]
    { x: 16.25, y: 62.22 },
    { x: 25.0, y: 62.22 },
    { x: 33.75, y: 62.22 },
    { x: 16.25, y: 77.78 },
    { x: 25.0, y: 77.78 },
]

const MakeSlotList = [
    //[0, 1, 2]
    //   [3, 4]
    { x: 45.625, y: 15.55 },
    { x: 53.125, y: 15.55 },
    { x: 60.625, y: 15.55 },
    { x: 53.125, y: 28.89 },
    { x: 60.625, y: 28.89 },
]

const SellItemOptions = {
    tree: 0,
    goods: 1,
    other: 2,
    mineral: 3,
    events: 4,
}

const SellOptions = [
    { x: 53.75, y: 22.22 }, // Trees
    { x: 53.75, y: 37.78 }, // Goods
    { x: 53.75, y: 53.33 }, // Others
    { x: 53.75, y: 68.88 }, // Mineral
    { x: 53.75, y: 84.44 }, // Events
]

const SellSlotList = [
    // [0, 1, 2, 3]
    // [4, 5, 6, 7]
    { x: 25.0, y: 36.67 },
    { x: 41.25, y: 36.67 },
    { x: 57.5, y: 36.67 },
    { x: 73.75, y: 36.67 },
    { x: 25.0, y: 75.56 },
    { x: 41.25, y: 75.56 },
    { x: 57.5, y: 75.56 },
    { x: 73.75, y: 75.56 },
]

const FriendHouseList = [
    { x: 7.5, y: 61.11 },
    { x: 22.5, y: 61.11 },
    { x: 37.5, y: 61.11 },
    { x: 52.5, y: 61.11 },
    { x: 67.5, y: 61.11 },
]

const ItemKeys = {
    nextOption: 'next-option',
    emptyProductionSlot: 'o-trong-san-xuat',
    emptySellSlot: 'o-trong-ban',
    soldSlot: 'o-da-ban',
    harvestBasket: 'thu-hoach',
    chest: 'ruong-bau',
    game: 'game',
    gameId: 'vn.kvtm.js',
    shopGem: 'shop-gem',
    goDownLast: 'xuong-day',
    friendHouse: 'friend-house',
    myHouse: 'my-house',
    livestockEvents: 'livestock-events',
}

const TreeKeys = {
    tao: 'tao',
    hong: 'hong',
    chanh: 'chanh',
    tuyet: 'tuyet',
    bong: 'bong',
    oaiHuong: 'oai-huong',
    dua: 'dua',
    duaHau: 'dua-hau',
}

const ProductKeys = {
    hatDuaSay: 'hat-dua-say',
    vaiTim: 'vai-tim',
    vaiDo: 'vai-do',
    vaiVang: 'vai-vang',
    nuocChanh: 'nuoc-chanh',
    nuocTuyet: 'nuoc-tuyet',
    tinhDauChanh: 'tinh-dau-chanh',
    tinhDauDua: 'tinh-dau-dua',
    tinhDauHoaHong: 'tinh-dau-hoa-hong',
    traHoaHong: 'tra-hoa-hong',
    nuocHoaHuongTao: 'nuoc-hoa-huong-tao',
    vaiXanhLa: 'vai-xanh-la',
}

const EventKeys = {
    bo: 'event-bo',
    ga: 'event-ga',
    cuu: 'event-cuu',
    heo: 'event-heo',
}

const AchievementKeys = {
    GapNhauMoiNgay: 'gap-nhau-moi-ngay',
}

const SlotPositions = {
    p1: '1',
    p2: '2',
    p3: '3',
    p4: '4',
    p1p2: '12',
    p1p3: '13',
    p2p4: '24',
    p3p4: '34',
}

module.exports = {
    DelayTime,
    DefaultBasket,
    DefaultProduct,
    FirstRowSlotList,
    SecondRowSlotList,
    SellOptions,
    PlantSlotList,
    MakeSlotList,
    SellItemOptions,
    SellSlotList,
    ItemKeys,
    ProductKeys,
    TreeKeys,
    EventKeys,
    AchievementKeys,
    FriendHouseList,
    SlotPositions,
}

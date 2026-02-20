export const MARKER_CATEGORIES = {
    'torso': { translationKey: 'torso', markers: ['C7', 'T10', 'CLAV', 'STRN', 'SACR'], color: 0xff6b6b, visible: true },
    'pelvis': { translationKey: 'pelvis', markers: ['RPSI', 'RASI', 'LPSI', 'LASI'], color: 0x4ecdc4, visible: true },
    'brazo_derecho': { translationKey: 'brazo_derecho', markers: ['RSHO', 'RUPA', 'RELB', 'RFRM', 'RWRB', 'RWRA', 'RWRT'], color: 0x45aaf2, visible: true },
    'brazo_izquierdo': { translationKey: 'brazo_izquierdo', markers: ['LSHO', 'LUPA', 'LELB', 'LFRM', 'LWRB', 'LWRA', 'LWRT'], color: 0x26de81, visible: true },
    'mano_derecha': { translationKey: 'mano_derecha', markers: ['RTMC','RTPX','RTDI','RTTP','RIMC','RFIN','RIIM','RITP','RMMC','RMPX','RMIM','RMTP','RRMC','RRPX','RRIM','RRTP','RLMC','RLPX','RLIM','RLTP','RPLM', 'RIDI', 'RLDI', 'RMDI', 'RRDI'], color: 0x32a6a8, visible: true },
    'mano_izquierda': { translationKey: 'mano_izquierda', markers: ['LTMC','LTPX','LTTP','LIMC','LFIN','LIIM','LITP','LMMC','LMPX','LMIM','LMTP','LRMC','LRPX','LRIM','LRTP','LLMC','LLPX','LLIM','LLTP', 'LPLM','LIDI', 'LLDI', 'LMDI', 'LRDI'], color: 0x32a869, visible: true },
    'pierna_derecha': { translationKey: 'pierna_derecha', markers: ['RTHI', 'RKNE', 'RSHN', 'RANK', 'RHEE', 'RTOE', 'RMT5'], color: 0xa55eea, visible: true },
    'pierna_izquierda': { translationKey: 'pierna_izquierda', markers: ['LTHI', 'LKNE', 'LSHN', 'LANK', 'LHEE', 'LTOE', 'LMT5'], color: 0xf7b731, visible: true },
    'cabeza': { translationKey: 'cabeza', markers: ['RBHD', 'LBHD', 'LFHD', 'RFHD', 'HEAD'], color: 0xfd9644, visible: true },
    'otros': { translationKey: 'otros', markers: [], color: 0x888888, visible: true }
};

export const ANALOG_COLOURS = {
    'emg': 0xff6b6b, 'fuerza': 0xfd9644, 'momento': 0x45aaf2,
    'acelerometro': 0x26de81, 'giroscopio': 0xa55eea, 'angulo': 0xf7b731, 'desconocido': 0x888888
};

export const CONECTIONS = [
    ['C7', 'CLAV'], ['CLAV', 'STRN'], ['STRN', 'T10'], ['C7', 'T10'], ['T10', 'SACR'], 
    ['CLAV', 'RASI'], ['CLAV', 'LASI'], ['C7', 'RPSI'], ['C7', 'LPSI'],
    ['STRN', 'RASI'], ['STRN', 'LASI'], ['T10', 'RPSI'], ['T10', 'LPSI'],
    ['SACR', 'RPSI'], ['SACR', 'LPSI'], ['RPSI', 'RASI'], ['LPSI', 'LASI'],
    ['RASI', 'LASI'], ['RPSI', 'LASI'], ['LPSI', 'RASI'],['RPSI', 'LPSI'],
    ['CLAV', 'RSHO'], ['C7', 'RSHO'], ['RSHO', 'RUPA'], ['RSHO', 'RELB'], 
    ['RUPA', 'RELB'], ['RELB', 'RFRM'], ['RELB', 'RWRB'],['RELB', 'RWRA'],['RELB', 'RWRT'],
    ['RFRM', 'RWRB'], ['RFRM', 'RWRA'], ['RWRB', 'RWRA'],
    ['CLAV', 'LSHO'], ['C7', 'LSHO'], ['LSHO', 'LUPA'], ['LSHO', 'LELB'],
    ['LUPA', 'LELB'], ['LELB', 'LFRM'], ['LELB', 'LWRB'],['LELB', 'LWRA'], ['LELB', 'LWRT'],
    ['LFRM', 'LWRB'], ['LFRM', 'LWRA'], ['LWRB', 'LWRA'],
    ['RASI', 'RTHI'], ['RPSI', 'RTHI'], ['RASI', 'RKNE'], ['RPSI', 'RKNE'],
    ['RTHI', 'RKNE'], ['RKNE', 'RSHN'], ['RKNE', 'RANK'], ['RSHN', 'RANK'], 
    ['RANK', 'RHEE'], ['RANK', 'RTOE'], ['RHEE', 'RTOE'], ['RTOE', 'RMT5'], ['RANK', 'RMT5'],
    ['LASI', 'LTHI'], ['LPSI', 'LTHI'], ['LASI', 'LKNE'], ['LPSI', 'LKNE'],
    ['LTHI', 'LKNE'], ['LKNE', 'LSHN'], ['LKNE', 'LANK'], ['LSHN', 'LANK'], 
    ['LANK', 'LHEE'], ['LANK', 'LTOE'], ['LHEE', 'LTOE'], ['LTOE', 'LMT5'], ['LANK', 'LMT5'],
    ['RBHD', 'LBHD'], ['LBHD', 'LFHD'], ['LFHD', 'RFHD'], ['RFHD', 'RBHD'],
    ['RBHD', 'LFHD'], ['LBHD', 'RFHD'],

    ['RWRA', 'RPLM'], ['RWRB', 'RPLM'],
    ['RPLM', 'RTMC'], ['RPLM', 'RIMC'], ['RPLM', 'RMMC'], ['RPLM', 'RRMC'], ['RPLM', 'RLMC'],
    ['RTMC', 'RTPX'], ['RTPX', 'RTDI'], ['RTDI', 'RTTP'],
    ['RIMC', 'RFIN'], ['RFIN', 'RIIM'], ['RIIM', 'RIDI'], ['RIDI', 'RITP'],
    ['RMMC', 'RMPX'], ['RMPX', 'RMIM'], ['RMIM', 'RMDI'], ['RMDI', 'RMTP'],
    ['RRMC', 'RRPX'], ['RRPX', 'RRIM'], ['RRIM', 'RRDI'], ['RRDI', 'RRTP'],
    ['RLMC', 'RLPX'], ['RLPX', 'RLIM'], ['RLIM', 'RLDI'], ['RLDI', 'RLTP'],

    ['LWRA', 'LPLM'], ['LWRB', 'LPLM'],
    ['LPLM', 'LTMC'], ['LPLM', 'LIMC'], ['LPLM', 'LMMC'], ['LPLM', 'LRMC'], ['LPLM', 'LLMC'],
    ['LTMC', 'LTPX'], ['LTPX', 'LTDI'], ['LTDI', 'LTTP'],
    ['LIMC', 'LFIN'], ['LFIN', 'LIIM'], ['LIIM', 'LIDI'], ['LIDI', 'LITP'],
    ['LMMC', 'LMPX'], ['LMPX', 'LMIM'], ['LMIM', 'LMDI'], ['LMDI', 'LMTP'],
    ['LRMC', 'LRPX'], ['LRPX', 'LRIM'], ['LRIM', 'LRDI'], ['LRDI', 'LRTP'],
    ['LLMC', 'LLPX'], ['LLPX', 'LLIM'], ['LLIM', 'LLDI'], ['LLDI', 'LLTP']

];

export const MARKERS_COLOURS = {
    'C7': 0xff0000, 'T10': 0xff5500, 'CLAV': 0xffff00, 'STRN': 0xff00ff, 'SACR': 0x00ffff,
    'RPSI': 0x0000ff, 'RASI': 0x0000ff, 'LPSI': 0x00ff00, 'LASI': 0x00ff00,
    'RSHO': 0x45aaf2, 'RUPA': 0x45aaf2, 'RELB': 0x45aaf2, 'RFRM': 0x45aaf2, 'RWRB': 0x45aaf2, 'RWRA': 0x45aaf2, 'RWRT': 0x45aaf2,
    'LSHO': 0x26de81, 'LUPA': 0x26de81, 'LELB': 0x26de81, 'LFRM': 0x26de81, 'LWRB': 0x26de81, 'LWRA': 0x26de81, 'LWRT': 0x26de81,
    'RTHI': 0xa55eea, 'RKNE': 0xa55eea, 'RSHN': 0xa55eea, 'RANK': 0xa55eea, 'RHEE': 0xa55eea, 'RTOE': 0xa55eea, 'RMT5': 0xa55eea,
    'LTHI': 0xf7b731, 'LKNE': 0xf7b731, 'LSHN': 0xf7b731, 'LANK': 0xf7b731, 'LHEE': 0xf7b731, 'LTOE': 0xf7b731, 'LMT5': 0xf7b731,
    'RBHD': 0xfd9644, 'LBHD': 0xfd9644, 'LFHD': 0xfd9644, 'RFHD': 0xfd9644, 'HEAD': 0xfd9644,
    "RTMC":0x32a6a8, "RTPX":0x32a6a8, "RTDI":0x32a6a8, "RTTP":0x32a6a8, "RIMC":0x32a6a8, "RFIN":0x32a6a8, "RIIM":0x32a6a8, 
    "RITP":0x32a6a8, "RMMC":0x32a6a8, "RMPX":0x32a6a8, "RMIM":0x32a6a8, "RMTP":0x32a6a8, "RRMC":0x32a6a8, "RRPX":0x32a6a8,
    "RRIM":0x32a6a8, "RRTP":0x32a6a8, "RLMC":0x32a6a8, "RLPX":0x32a6a8, "RLIM":0x32a6a8, "RLTP":0x32a6a8, "RPLM":0x32a6a8, 
    "RIDI":0x32a6a8, "RLDI":0x32a6a8, "RMDI":0x32a6a8 , "RRDI": 0x32a6a8,
    "LTMC":0x32a869, "LTPX":0x32a869, "LTDI":0x32a869, "LTTP":0x32a869, "LIMC":0x32a869, "LFIN":0x32a869, "LIIM":0x32a869,
    "LITP":0x32a869, "LMMC":0x32a869, "LMPX":0x32a869, "LMIM":0x32a869, "LMTP":0x32a869, "LRMC":0x32a869, "LRPX":0x32a869,
    "LRIM":0x32a869, "LRTP":0x32a869, "LLMC":0x32a869, "LLPX":0x32a869, "LLIM":0x32a869, "LLTP":0x32a869, "LPLM":0x32a869, 
    'LIDI':0x32a869, 'LLDI':0x32a869, 'LMDI':0x32a869 , 'LRDI': 0x32a869
};

export const HEAD_MARKERS = ['RBHD', 'LBHD', 'LFHD', 'RFHD'];

// Used in kinematics.js for bone-to-bone alignment
export const FINGER_MARKERS = {
    Right: {
        Thumb:  ['RTMC', 'RTPX', 'RTDI', 'RTTP'],
        Index:  ['RIMC', 'RFIN', 'RIIM', 'RITP'], 
        Middle: ['RMMC', 'RMPX', 'RMIM', 'RMTP'],
        Ring:   ['RRMC', 'RRPX', 'RRIM', 'RRTP'],
        Pinky:  ['RLMC', 'RLPX', 'RLIM', 'RLTP']
    },
    Left: {
        Thumb:  ['LTMC', 'LTPX', 'LTDI', 'LTTP'],
        Index:  ['LIMC', 'LFIN', 'LIIM', 'LITP'],
        Middle: ['LMMC', 'LMPX', 'LMIM', 'LMTP'],
        Ring:   ['LRMC', 'LRPX', 'LRIM', 'LRTP'],
        Pinky:  ['LLMC', 'LLPX', 'LLIM', 'LLTP']
    }
};

// Used in main.js for marker identification and UI scaling
export const HAND_MARKERS_SET = new Set([
    // --- Mano Derecha ---
    'RTMC', 'RTPX', 'RTDI', 'RTTP', // Pulgar
    'RIMC', 'RFIN', 'RIIM', 'RITP', 'RIDI', // Índice
    'RMMC', 'RMPX', 'RMIM', 'RMTP', 'RMDI',// Medio
    'RRMC', 'RRPX', 'RRIM', 'RRTP', 'RRDI',// Anular
    'RLMC', 'RLPX', 'RLIM', 'RLTP', 'RLDI',// Meñique
    'RPLM', // Palma
    
    // --- Mano Izquierda ---
    'LTMC', 'LTPX', 'LTDI', 'LTTP', 
    'LIMC', 'LFIN', 'LIIM', 'LITP', 'LIDI',
    'LMMC', 'LMPX', 'LMIM', 'LMTP', 'LMDI',
    'LRMC', 'LRPX', 'LRIM', 'LRTP', 'LRDI',
    'LLMC', 'LLPX', 'LLIM', 'LLTP', 'LLDI',
    'LPLM'
]);
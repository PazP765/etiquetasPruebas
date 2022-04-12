
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.QRious = factory());
  }(this, (function () { 'use strict';
  
    
  

    var Constructor =  function() {};

    var hasOwnProperty = Object.prototype.hasOwnProperty;

    var slice = Array.prototype.slice;
  
    
    function createObject(prototype, properties) {
      var result;
    
      if (typeof Object.create === 'function') {
        result = Object.create(prototype);
      } else {
        Constructor.prototype = prototype;
        result = new Constructor();
        Constructor.prototype = null;
      }
  
      if (properties) {
        extendObject(true, result, properties);
      }
  
      return result;
    }
  
   
    function extend(name, constructor, prototype, statics) {
      var superConstructor = this;
  
      if (typeof name !== 'string') {
        statics = prototype;
        prototype = constructor;
        constructor = name;
        name = null;
      }
  
      if (typeof constructor !== 'function') {
        statics = prototype;
        prototype = constructor;
        constructor = function() {
          return superConstructor.apply(this, arguments);
        };
      }
  
      extendObject(false, constructor, superConstructor, statics);
  
      constructor.prototype = createObject(superConstructor.prototype, prototype);
      constructor.prototype.constructor = constructor;
  
      constructor.class_ = name || superConstructor.class_;
      constructor.super_ = superConstructor;
  
      return constructor;
    }
  
    
    function extendObject(own, target, sources) {
      sources = slice.call(arguments, 2);
  
      var property;
      var source;
  
      for (var i = 0, length = sources.length; i < length; i++) {
        source = sources[i];
  
        for (property in source) {
          if (!own || hasOwnProperty.call(source, property)) {
            target[property] = source[property];
          }
        }
      }
    }
  
    var extend_1 = extend;
  
    
    function Nevis() {}
    Nevis.class_ = 'Nevis';
    Nevis.super_ = Object;
  
    
    Nevis.extend = extend_1;
  
    var nevis = Nevis;
  
    var lite = nevis;
  
    
    var Renderer = lite.extend(function(qrious, element, enabled) {
     
      this.qrious = qrious;
  
      
      this.element = element;
      this.element.qrious = qrious;
  
      
      this.enabled = Boolean(enabled);
    }, {
  
     
      draw: function(frame) {},
  
      
      getElement: function() {
        if (!this.enabled) {
          this.enabled = true;
          this.render();
        }
  
        return this.element;
      },
  
     
      getModuleSize: function(frame) {
        var qrious = this.qrious;
        var padding = qrious.padding || 0;
        var pixels = Math.floor((qrious.size - (padding * 2)) / frame.width);
  
        return Math.max(1, pixels);
      },
  
     
      getOffset: function(frame) {
        var qrious = this.qrious;
        var padding = qrious.padding;
  
        if (padding != null) {
          return padding;
        }
  
        var moduleSize = this.getModuleSize(frame);
        var offset = Math.floor((qrious.size - (moduleSize * frame.width)) / 2);
  
        return Math.max(0, offset);
      },
  
      
      render: function(frame) {
        if (this.enabled) {
          this.resize();
          this.reset();
          this.draw(frame);
        }
      },
  
      
      reset: function() {},
  
      
      resize: function() {}
  
    });
  
    var Renderer_1 = Renderer;
  
    
    var CanvasRenderer = Renderer_1.extend({
  
      
      draw: function(frame) {
        var i, j;
        var qrious = this.qrious;
        var moduleSize = this.getModuleSize(frame);
        var offset = this.getOffset(frame);
        var context = this.element.getContext('2d');
  
        context.fillStyle = qrious.foreground;
        context.globalAlpha = qrious.foregroundAlpha;
  
        for (i = 0; i < frame.width; i++) {
          for (j = 0; j < frame.width; j++) {
            if (frame.buffer[(j * frame.width) + i]) {
              context.fillRect((moduleSize * i) + offset, (moduleSize * j) + offset, moduleSize, moduleSize);
            }
          }
        }
      },
  
      
      reset: function() {
        var qrious = this.qrious;
        var context = this.element.getContext('2d');
        var size = qrious.size;
  
        context.lineWidth = 1;
        context.clearRect(0, 0, size, size);
        context.fillStyle = qrious.background;
        context.globalAlpha = qrious.backgroundAlpha;
        context.fillRect(0, 0, size, size);
      },
  

      resize: function() {
        var element = this.element;
  
        element.width = element.height = this.qrious.size;
      }
  
    });
  
    var CanvasRenderer_1 = CanvasRenderer;
  
   
    var Alignment = lite.extend(null, {
  
     
      BLOCK: [
        0,  11, 15, 19, 23, 27, 31,
        16, 18, 20, 22, 24, 26, 28, 20, 22, 24, 24, 26, 28, 28, 22, 24, 24,
        26, 26, 28, 28, 24, 24, 26, 26, 26, 28, 28, 24, 26, 26, 26, 28, 28
      ]
  
    });
  
    var Alignment_1 = Alignment;
  
    
    var ErrorCorrection = lite.extend(null, {
  
      
      BLOCKS: [
        1,  0,  19,  7,     1,  0,  16,  10,    1,  0,  13,  13,    1,  0,  9,   17,
        1,  0,  34,  10,    1,  0,  28,  16,    1,  0,  22,  22,    1,  0,  16,  28,
        1,  0,  55,  15,    1,  0,  44,  26,    2,  0,  17,  18,    2,  0,  13,  22,
        1,  0,  80,  20,    2,  0,  32,  18,    2,  0,  24,  26,    4,  0,  9,   16,
        1,  0,  108, 26,    2,  0,  43,  24,    2,  2,  15,  18,    2,  2,  11,  22,
        2,  0,  68,  18,    4,  0,  27,  16,    4,  0,  19,  24,    4,  0,  15,  28,
        2,  0,  78,  20,    4,  0,  31,  18,    2,  4,  14,  18,    4,  1,  13,  26,
        2,  0,  97,  24,    2,  2,  38,  22,    4,  2,  18,  22,    4,  2,  14,  26,
        2,  0,  116, 30,    3,  2,  36,  22,    4,  4,  16,  20,    4,  4,  12,  24,
        2,  2,  68,  18,    4,  1,  43,  26,    6,  2,  19,  24,    6,  2,  15,  28,
        4,  0,  81,  20,    1,  4,  50,  30,    4,  4,  22,  28,    3,  8,  12,  24,
        2,  2,  92,  24,    6,  2,  36,  22,    4,  6,  20,  26,    7,  4,  14,  28,
        4,  0,  107, 26,    8,  1,  37,  22,    8,  4,  20,  24,    12, 4,  11,  22,
        3,  1,  115, 30,    4,  5,  40,  24,    11, 5,  16,  20,    11, 5,  12,  24,
        5,  1,  87,  22,    5,  5,  41,  24,    5,  7,  24,  30,    11, 7,  12,  24,
        5,  1,  98,  24,    7,  3,  45,  28,    15, 2,  19,  24,    3,  13, 15,  30,
        1,  5,  107, 28,    10, 1,  46,  28,    1,  15, 22,  28,    2,  17, 14,  28,
        5,  1,  120, 30,    9,  4,  43,  26,    17, 1,  22,  28,    2,  19, 14,  28,
        3,  4,  113, 28,    3,  11, 44,  26,    17, 4,  21,  26,    9,  16, 13,  26,
        3,  5,  107, 28,    3,  13, 41,  26,    15, 5,  24,  30,    15, 10, 15,  28,
        4,  4,  116, 28,    17, 0,  42,  26,    17, 6,  22,  28,    19, 6,  16,  30,
        2,  7,  111, 28,    17, 0,  46,  28,    7,  16, 24,  30,    34, 0,  13,  24,
        4,  5,  121, 30,    4,  14, 47,  28,    11, 14, 24,  30,    16, 14, 15,  30,
        6,  4,  117, 30,    6,  14, 45,  28,    11, 16, 24,  30,    30, 2,  16,  30,
        8,  4,  106, 26,    8,  13, 47,  28,    7,  22, 24,  30,    22, 13, 15,  30,
        10, 2,  114, 28,    19, 4,  46,  28,    28, 6,  22,  28,    33, 4,  16,  30,
        8,  4,  122, 30,    22, 3,  45,  28,    8,  26, 23,  30,    12, 28, 15,  30,
        3,  10, 117, 30,    3,  23, 45,  28,    4,  31, 24,  30,    11, 31, 15,  30,
        7,  7,  116, 30,    21, 7,  45,  28,    1,  37, 23,  30,    19, 26, 15,  30,
        5,  10, 115, 30,    19, 10, 47,  28,    15, 25, 24,  30,    23, 25, 15,  30,
        13, 3,  115, 30,    2,  29, 46,  28,    42, 1,  24,  30,    23, 28, 15,  30,
        17, 0,  115, 30,    10, 23, 46,  28,    10, 35, 24,  30,    19, 35, 15,  30,
        17, 1,  115, 30,    14, 21, 46,  28,    29, 19, 24,  30,    11, 46, 15,  30,
        13, 6,  115, 30,    14, 23, 46,  28,    44, 7,  24,  30,    59, 1,  16,  30,
        12, 7,  121, 30,    12, 26, 47,  28,    39, 14, 24,  30,    22, 41, 15,  30,
        6,  14, 121, 30,    6,  34, 47,  28,    46, 10, 24,  30,    2,  64, 15,  30,
        17, 4,  122, 30,    29, 14, 46,  28,    49, 10, 24,  30,    24, 46, 15,  30,
        4,  18, 122, 30,    13, 32, 46,  28,    48, 14, 24,  30,    42, 32, 15,  30,
        20, 4,  117, 30,    40, 7,  47,  28,    43, 22, 24,  30,    10, 67, 15,  30,
        19, 6,  118, 30,    18, 31, 47,  28,    34, 34, 24,  30,    20, 61, 15,  30
      ],
  
     
      FINAL_FORMAT: [
        
        0x77c4, 0x72f3, 0x7daa, 0x789d, 0x662f, 0x6318, 0x6c41, 0x6976,
        
        0x5412, 0x5125, 0x5e7c, 0x5b4b, 0x45f9, 0x40ce, 0x4f97, 0x4aa0,
        
        0x355f, 0x3068, 0x3f31, 0x3a06, 0x24b4, 0x2183, 0x2eda, 0x2bed,
        
        0x1689, 0x13be, 0x1ce7, 0x19d0, 0x0762, 0x0255, 0x0d0c, 0x083b
      ],
  
      
      LEVELS: {
        L: 1,
        M: 2,
        Q: 3,
        H: 4
      }
  
    });
  
    var ErrorCorrection_1 = ErrorCorrection;
  
    
    var Galois = lite.extend(null, {
  
      
      EXPONENT: [
        0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1d, 0x3a, 0x74, 0xe8, 0xcd, 0x87, 0x13, 0x26,
        0x4c, 0x98, 0x2d, 0x5a, 0xb4, 0x75, 0xea, 0xc9, 0x8f, 0x03, 0x06, 0x0c, 0x18, 0x30, 0x60, 0xc0,
        0x9d, 0x27, 0x4e, 0x9c, 0x25, 0x4a, 0x94, 0x35, 0x6a, 0xd4, 0xb5, 0x77, 0xee, 0xc1, 0x9f, 0x23,
        0x46, 0x8c, 0x05, 0x0a, 0x14, 0x28, 0x50, 0xa0, 0x5d, 0xba, 0x69, 0xd2, 0xb9, 0x6f, 0xde, 0xa1,
        0x5f, 0xbe, 0x61, 0xc2, 0x99, 0x2f, 0x5e, 0xbc, 0x65, 0xca, 0x89, 0x0f, 0x1e, 0x3c, 0x78, 0xf0,
        0xfd, 0xe7, 0xd3, 0xbb, 0x6b, 0xd6, 0xb1, 0x7f, 0xfe, 0xe1, 0xdf, 0xa3, 0x5b, 0xb6, 0x71, 0xe2,
        0xd9, 0xaf, 0x43, 0x86, 0x11, 0x22, 0x44, 0x88, 0x0d, 0x1a, 0x34, 0x68, 0xd0, 0xbd, 0x67, 0xce,
        0x81, 0x1f, 0x3e, 0x7c, 0xf8, 0xed, 0xc7, 0x93, 0x3b, 0x76, 0xec, 0xc5, 0x97, 0x33, 0x66, 0xcc,
        0x85, 0x17, 0x2e, 0x5c, 0xb8, 0x6d, 0xda, 0xa9, 0x4f, 0x9e, 0x21, 0x42, 0x84, 0x15, 0x2a, 0x54,
        0xa8, 0x4d, 0x9a, 0x29, 0x52, 0xa4, 0x55, 0xaa, 0x49, 0x92, 0x39, 0x72, 0xe4, 0xd5, 0xb7, 0x73,
        0xe6, 0xd1, 0xbf, 0x63, 0xc6, 0x91, 0x3f, 0x7e, 0xfc, 0xe5, 0xd7, 0xb3, 0x7b, 0xf6, 0xf1, 0xff,
        0xe3, 0xdb, 0xab, 0x4b, 0x96, 0x31, 0x62, 0xc4, 0x95, 0x37, 0x6e, 0xdc, 0xa5, 0x57, 0xae, 0x41,
        0x82, 0x19, 0x32, 0x64, 0xc8, 0x8d, 0x07, 0x0e, 0x1c, 0x38, 0x70, 0xe0, 0xdd, 0xa7, 0x53, 0xa6,
        0x51, 0xa2, 0x59, 0xb2, 0x79, 0xf2, 0xf9, 0xef, 0xc3, 0x9b, 0x2b, 0x56, 0xac, 0x45, 0x8a, 0x09,
        0x12, 0x24, 0x48, 0x90, 0x3d, 0x7a, 0xf4, 0xf5, 0xf7, 0xf3, 0xfb, 0xeb, 0xcb, 0x8b, 0x0b, 0x16,
        0x2c, 0x58, 0xb0, 0x7d, 0xfa, 0xe9, 0xcf, 0x83, 0x1b, 0x36, 0x6c, 0xd8, 0xad, 0x47, 0x8e, 0x00
      ],
  
     
      LOG: [
        0xff, 0x00, 0x01, 0x19, 0x02, 0x32, 0x1a, 0xc6, 0x03, 0xdf, 0x33, 0xee, 0x1b, 0x68, 0xc7, 0x4b,
        0x04, 0x64, 0xe0, 0x0e, 0x34, 0x8d, 0xef, 0x81, 0x1c, 0xc1, 0x69, 0xf8, 0xc8, 0x08, 0x4c, 0x71,
        0x05, 0x8a, 0x65, 0x2f, 0xe1, 0x24, 0x0f, 0x21, 0x35, 0x93, 0x8e, 0xda, 0xf0, 0x12, 0x82, 0x45,
        0x1d, 0xb5, 0xc2, 0x7d, 0x6a, 0x27, 0xf9, 0xb9, 0xc9, 0x9a, 0x09, 0x78, 0x4d, 0xe4, 0x72, 0xa6,
        0x06, 0xbf, 0x8b, 0x62, 0x66, 0xdd, 0x30, 0xfd, 0xe2, 0x98, 0x25, 0xb3, 0x10, 0x91, 0x22, 0x88,
        0x36, 0xd0, 0x94, 0xce, 0x8f, 0x96, 0xdb, 0xbd, 0xf1, 0xd2, 0x13, 0x5c, 0x83, 0x38, 0x46, 0x40,
        0x1e, 0x42, 0xb6, 0xa3, 0xc3, 0x48, 0x7e, 0x6e, 0x6b, 0x3a, 0x28, 0x54, 0xfa, 0x85, 0xba, 0x3d,
        0xca, 0x5e, 0x9b, 0x9f, 0x0a, 0x15, 0x79, 0x2b, 0x4e, 0xd4, 0xe5, 0xac, 0x73, 0xf3, 0xa7, 0x57,
        0x07, 0x70, 0xc0, 0xf7, 0x8c, 0x80, 0x63, 0x0d, 0x67, 0x4a, 0xde, 0xed, 0x31, 0xc5, 0xfe, 0x18,
        0xe3, 0xa5, 0x99, 0x77, 0x26, 0xb8, 0xb4, 0x7c, 0x11, 0x44, 0x92, 0xd9, 0x23, 0x20, 0x89, 0x2e,
        0x37, 0x3f, 0xd1, 0x5b, 0x95, 0xbc, 0xcf, 0xcd, 0x90, 0x87, 0x97, 0xb2, 0xdc, 0xfc, 0xbe, 0x61,
        0xf2, 0x56, 0xd3, 0xab, 0x14, 0x2a, 0x5d, 0x9e, 0x84, 0x3c, 0x39, 0x53, 0x47, 0x6d, 0x41, 0xa2,
        0x1f, 0x2d, 0x43, 0xd8, 0xb7, 0x7b, 0xa4, 0x76, 0xc4, 0x17, 0x49, 0xec, 0x7f, 0x0c, 0x6f, 0xf6,
        0x6c, 0xa1, 0x3b, 0x52, 0x29, 0x9d, 0x55, 0xaa, 0xfb, 0x60, 0x86, 0xb1, 0xbb, 0xcc, 0x3e, 0x5a,
        0xcb, 0x59, 0x5f, 0xb0, 0x9c, 0xa9, 0xa0, 0x51, 0x0b, 0xf5, 0x16, 0xeb, 0x7a, 0x75, 0x2c, 0xd7,
        0x4f, 0xae, 0xd5, 0xe9, 0xe6, 0xe7, 0xad, 0xe8, 0x74, 0xd6, 0xf4, 0xea, 0xa8, 0x50, 0x58, 0xaf
      ]
  
    });
  
    var Galois_1 = Galois;
  
    
    var Version = lite.extend(null, {
  
      
      BLOCK: [
        0xc94, 0x5bc, 0xa99, 0x4d3, 0xbf6, 0x762, 0x847, 0x60d, 0x928, 0xb78, 0x45d, 0xa17, 0x532,
        0x9a6, 0x683, 0x8c9, 0x7ec, 0xec4, 0x1e1, 0xfab, 0x08e, 0xc1a, 0x33f, 0xd75, 0x250, 0x9d5,
        0x6f0, 0x8ba, 0x79f, 0xb0b, 0x42e, 0xa64, 0x541, 0xc69
      ]
  
    });
  
    var Version_1 = Version;
  
    
    var Frame = lite.extend(function(options) {
      var dataBlock, eccBlock, index, neccBlock1, neccBlock2;
      var valueLength = options.value.length;
  
      this._badness = [];
      this._level = ErrorCorrection_1.LEVELS[options.level];
      this._polynomial = [];
      this._value = options.value;
      this._version = 0;
      this._stringBuffer = [];
  
      while (this._version < 40) {
        this._version++;
  
        index = ((this._level - 1) * 4) + ((this._version - 1) * 16);
  
        neccBlock1 = ErrorCorrection_1.BLOCKS[index++];
        neccBlock2 = ErrorCorrection_1.BLOCKS[index++];
        dataBlock = ErrorCorrection_1.BLOCKS[index++];
        eccBlock = ErrorCorrection_1.BLOCKS[index];
  
        index = (dataBlock * (neccBlock1 + neccBlock2)) + neccBlock2 - 3 + (this._version <= 9);
  
        if (valueLength <= index) {
          break;
        }
      }
  
      this._dataBlock = dataBlock;
      this._eccBlock = eccBlock;
      this._neccBlock1 = neccBlock1;
      this._neccBlock2 = neccBlock2;
  
      
      var width = this.width = 17 + (4 * this._version);
  
     
      this.buffer = Frame._createArray(width * width);
  
      this._ecc = Frame._createArray(dataBlock + ((dataBlock + eccBlock) * (neccBlock1 + neccBlock2)) + neccBlock2);
      this._mask = Frame._createArray(((width * (width + 1)) + 1) / 2);
  
      this._insertFinders();
      this._insertAlignments();
  
     
      this.buffer[8 + (width * (width - 8))] = 1;
  
      this._insertTimingGap();
      this._reverseMask();
      this._insertTimingRowAndColumn();
      this._insertVersion();
      this._syncMask();
      this._convertBitStream(valueLength);
      this._calculatePolynomial();
      this._appendEccToData();
      this._interleaveBlocks();
      this._pack();
      this._finish();
    }, {
  
      _addAlignment: function(x, y) {
        var i;
        var buffer = this.buffer;
        var width = this.width;
  
        buffer[x + (width * y)] = 1;
  
        for (i = -2; i < 2; i++) {
          buffer[x + i + (width * (y - 2))] = 1;
          buffer[x - 2 + (width * (y + i + 1))] = 1;
          buffer[x + 2 + (width * (y + i))] = 1;
          buffer[x + i + 1 + (width * (y + 2))] = 1;
        }
  
        for (i = 0; i < 2; i++) {
          this._setMask(x - 1, y + i);
          this._setMask(x + 1, y - i);
          this._setMask(x - i, y - 1);
          this._setMask(x + i, y + 1);
        }
      },
  
      _appendData: function(data, dataLength, ecc, eccLength) {
        var bit, i, j;
        var polynomial = this._polynomial;
        var stringBuffer = this._stringBuffer;
  
        for (i = 0; i < eccLength; i++) {
          stringBuffer[ecc + i] = 0;
        }
  
        for (i = 0; i < dataLength; i++) {
          bit = Galois_1.LOG[stringBuffer[data + i] ^ stringBuffer[ecc]];
  
          if (bit !== 255) {
            for (j = 1; j < eccLength; j++) {
              stringBuffer[ecc + j - 1] = stringBuffer[ecc + j] ^
                Galois_1.EXPONENT[Frame._modN(bit + polynomial[eccLength - j])];
            }
          } else {
            for (j = ecc; j < ecc + eccLength; j++) {
              stringBuffer[j] = stringBuffer[j + 1];
            }
          }
  
          stringBuffer[ecc + eccLength - 1] = bit === 255 ? 0 : Galois_1.EXPONENT[Frame._modN(bit + polynomial[0])];
        }
      },
  
      _appendEccToData: function() {
        var i;
        var data = 0;
        var dataBlock = this._dataBlock;
        var ecc = this._calculateMaxLength();
        var eccBlock = this._eccBlock;
  
        for (i = 0; i < this._neccBlock1; i++) {
          this._appendData(data, dataBlock, ecc, eccBlock);
  
          data += dataBlock;
          ecc += eccBlock;
        }
  
        for (i = 0; i < this._neccBlock2; i++) {
          this._appendData(data, dataBlock + 1, ecc, eccBlock);
  
          data += dataBlock + 1;
          ecc += eccBlock;
        }
      },
  
      _applyMask: function(mask) {
        var r3x, r3y, x, y;
        var buffer = this.buffer;
        var width = this.width;
  
        switch (mask) {
        case 0:
          for (y = 0; y < width; y++) {
            for (x = 0; x < width; x++) {
              if (!((x + y) & 1) && !this._isMasked(x, y)) {
                buffer[x + (y * width)] ^= 1;
              }
            }
          }
  
          break;
        case 1:
          for (y = 0; y < width; y++) {
            for (x = 0; x < width; x++) {
              if (!(y & 1) && !this._isMasked(x, y)) {
                buffer[x + (y * width)] ^= 1;
              }
            }
          }
  
          break;
        case 2:
          for (y = 0; y < width; y++) {
            for (r3x = 0, x = 0; x < width; x++, r3x++) {
              if (r3x === 3) {
                r3x = 0;
              }
  
              if (!r3x && !this._isMasked(x, y)) {
                buffer[x + (y * width)] ^= 1;
              }
            }
          }
  
          break;
        case 3:
          for (r3y = 0, y = 0; y < width; y++, r3y++) {
            if (r3y === 3) {
              r3y = 0;
            }
  
            for (r3x = r3y, x = 0; x < width; x++, r3x++) {
              if (r3x === 3) {
                r3x = 0;
              }
  
              if (!r3x && !this._isMasked(x, y)) {
                buffer[x + (y * width)] ^= 1;
              }
            }
          }
  
          break;
        case 4:
          for (y = 0; y < width; y++) {
            for (r3x = 0, r3y = (y >> 1) & 1, x = 0; x < width; x++, r3x++) {
              if (r3x === 3) {
                r3x = 0;
                r3y = !r3y;
              }
  
              if (!r3y && !this._isMasked(x, y)) {
                buffer[x + (y * width)] ^= 1;
              }
            }
          }
  
          break;
        case 5:
          for (r3y = 0, y = 0; y < width; y++, r3y++) {
            if (r3y === 3) {
              r3y = 0;
            }
  
            for (r3x = 0, x = 0; x < width; x++, r3x++) {
              if (r3x === 3) {
                r3x = 0;
              }
  
              if (!((x & y & 1) + !(!r3x | !r3y)) && !this._isMasked(x, y)) {
                buffer[x + (y * width)] ^= 1;
              }
            }
          }
  
          break;
        case 6:
          for (r3y = 0, y = 0; y < width; y++, r3y++) {
            if (r3y === 3) {
              r3y = 0;
            }
  
            for (r3x = 0, x = 0; x < width; x++, r3x++) {
              if (r3x === 3) {
                r3x = 0;
              }
  
              if (!((x & y & 1) + (r3x && r3x === r3y) & 1) && !this._isMasked(x, y)) {
                buffer[x + (y * width)] ^= 1;
              }
            }
          }
  
          break;
        case 7:
          for (r3y = 0, y = 0; y < width; y++, r3y++) {
            if (r3y === 3) {
              r3y = 0;
            }
  
            for (r3x = 0, x = 0; x < width; x++, r3x++) {
              if (r3x === 3) {
                r3x = 0;
              }
  
              if (!((r3x && r3x === r3y) + (x + y & 1) & 1) && !this._isMasked(x, y)) {
                buffer[x + (y * width)] ^= 1;
              }
            }
          }
  
          break;
        }
      },
  
      _calculateMaxLength: function() {
        return (this._dataBlock * (this._neccBlock1 + this._neccBlock2)) + this._neccBlock2;
      },
  
      _calculatePolynomial: function() {
        var i, j;
        var eccBlock = this._eccBlock;
        var polynomial = this._polynomial;
  
        polynomial[0] = 1;
  
        for (i = 0; i < eccBlock; i++) {
          polynomial[i + 1] = 1;
  
          for (j = i; j > 0; j--) {
            polynomial[j] = polynomial[j] ? polynomial[j - 1] ^
              Galois_1.EXPONENT[Frame._modN(Galois_1.LOG[polynomial[j]] + i)] : polynomial[j - 1];
          }
  
          polynomial[0] = Galois_1.EXPONENT[Frame._modN(Galois_1.LOG[polynomial[0]] + i)];
        }
  
    
        for (i = 0; i <= eccBlock; i++) {
          polynomial[i] = Galois_1.LOG[polynomial[i]];
        }
      },
  
      _checkBadness: function() {
        var b, b1, h, x, y;
        var bad = 0;
        var badness = this._badness;
        var buffer = this.buffer;
        var width = this.width;
  

        for (y = 0; y < width - 1; y++) {
          for (x = 0; x < width - 1; x++) {

            if ((buffer[x + (width * y)] &&
              buffer[x + 1 + (width * y)] &&
              buffer[x + (width * (y + 1))] &&
              buffer[x + 1 + (width * (y + 1))]) ||

              !(buffer[x + (width * y)] ||
              buffer[x + 1 + (width * y)] ||
              buffer[x + (width * (y + 1))] ||
              buffer[x + 1 + (width * (y + 1))])) {
              bad += Frame.N2;
            }
          }
        }
  
        var bw = 0;
  

        for (y = 0; y < width; y++) {
          h = 0;
  
          badness[0] = 0;
  
          for (b = 0, x = 0; x < width; x++) {
            b1 = buffer[x + (width * y)];
  
            if (b === b1) {
              badness[h]++;
            } else {
              badness[++h] = 1;
            }
  
            b = b1;
            bw += b ? 1 : -1;
          }
  
          bad += this._getBadness(h);
        }
  
        if (bw < 0) {
          bw = -bw;
        }
  
        var count = 0;
        var big = bw;
        big += big << 2;
        big <<= 1;
  
        while (big > width * width) {
          big -= width * width;
          count++;
        }
  
        bad += count * Frame.N4;
  
    
        for (x = 0; x < width; x++) {
          h = 0;
  
          badness[0] = 0;
  
          for (b = 0, y = 0; y < width; y++) {
            b1 = buffer[x + (width * y)];
  
            if (b === b1) {
              badness[h]++;
            } else {
              badness[++h] = 1;
            }
  
            b = b1;
          }
  
          bad += this._getBadness(h);
        }
  
        return bad;
      },
  
      _convertBitStream: function(length) {
        var bit, i;
        var ecc = this._ecc;
        var version = this._version;
  
       
        for (i = 0; i < length; i++) {
          ecc[i] = this._value.charCodeAt(i);
        }
  
        var stringBuffer = this._stringBuffer = ecc.slice();
        var maxLength = this._calculateMaxLength();
  
        if (length >= maxLength - 2) {
          length = maxLength - 2;
  
          if (version > 9) {
            length--;
          }
        }
  
        var index = length;
  
        if (version > 9) {
          stringBuffer[index + 2] = 0;
          stringBuffer[index + 3] = 0;
  
          while (index--) {
            bit = stringBuffer[index];
  
            stringBuffer[index + 3] |= 255 & (bit << 4);
            stringBuffer[index + 2] = bit >> 4;
          }
  
          stringBuffer[2] |= 255 & (length << 4);
          stringBuffer[1] = length >> 4;
          stringBuffer[0] = 0x40 | (length >> 12);
        } else {
          stringBuffer[index + 1] = 0;
          stringBuffer[index + 2] = 0;
  
          while (index--) {
            bit = stringBuffer[index];
  
            stringBuffer[index + 2] |= 255 & (bit << 4);
            stringBuffer[index + 1] = bit >> 4;
          }
  
          stringBuffer[1] |= 255 & (length << 4);
          stringBuffer[0] = 0x40 | (length >> 4);
        }
  
        index = length + 3 - (version < 10);
  
        while (index < maxLength) {
          stringBuffer[index++] = 0xec;
          stringBuffer[index++] = 0x11;
        }
      },
      _getBadness: function(length) {
        var i;
        var badRuns = 0;
        var badness = this._badness;
  
        for (i = 0; i <= length; i++) {
          if (badness[i] >= 5) {
            badRuns += Frame.N1 + badness[i] - 5;
          }
        }
  
        for (i = 3; i < length - 1; i += 2) {
          if (badness[i - 2] === badness[i + 2] &&
            badness[i + 2] === badness[i - 1] &&
            badness[i - 1] === badness[i + 1] &&
            badness[i - 1] * 3 === badness[i] &&

            (badness[i - 3] === 0 || i + 3 > length ||
            badness[i - 3] * 3 >= badness[i] * 4 ||
            badness[i + 3] * 3 >= badness[i] * 4)) {
            badRuns += Frame.N3;
          }
        }
  
        return badRuns;
      },
  
      _finish: function() {

        this._stringBuffer = this.buffer.slice();
  
        var currentMask, i;
        var bit = 0;
        var mask = 30000;

        for (i = 0; i < 8; i++) {

          this._applyMask(i);
  
          currentMask = this._checkBadness();
  

          if (currentMask < mask) {
            mask = currentMask;
            bit = i;
          }
  

          if (bit === 7) {
            break;
          }
  

          this.buffer = this._stringBuffer.slice();
        }
  

        if (bit !== i) {
          this._applyMask(bit);
        }
  

        mask = ErrorCorrection_1.FINAL_FORMAT[bit + (this._level - 1 << 3)];
  
        var buffer = this.buffer;
        var width = this.width;
  

        for (i = 0; i < 8; i++, mask >>= 1) {
          if (mask & 1) {
            buffer[width - 1 - i + (width * 8)] = 1;
  
            if (i < 6) {
              buffer[8 + (width * i)] = 1;
            } else {
              buffer[8 + (width * (i + 1))] = 1;
            }
          }
        }
  

        for (i = 0; i < 7; i++, mask >>= 1) {
          if (mask & 1) {
            buffer[8 + (width * (width - 7 + i))] = 1;
  
            if (i) {
              buffer[6 - i + (width * 8)] = 1;
            } else {
              buffer[7 + (width * 8)] = 1;
            }
          }
        }
      },
  
      _interleaveBlocks: function() {
        var i, j;
        var dataBlock = this._dataBlock;
        var ecc = this._ecc;
        var eccBlock = this._eccBlock;
        var k = 0;
        var maxLength = this._calculateMaxLength();
        var neccBlock1 = this._neccBlock1;
        var neccBlock2 = this._neccBlock2;
        var stringBuffer = this._stringBuffer;
  
        for (i = 0; i < dataBlock; i++) {
          for (j = 0; j < neccBlock1; j++) {
            ecc[k++] = stringBuffer[i + (j * dataBlock)];
          }
  
          for (j = 0; j < neccBlock2; j++) {
            ecc[k++] = stringBuffer[(neccBlock1 * dataBlock) + i + (j * (dataBlock + 1))];
          }
        }
  
        for (j = 0; j < neccBlock2; j++) {
          ecc[k++] = stringBuffer[(neccBlock1 * dataBlock) + i + (j * (dataBlock + 1))];
        }
  
        for (i = 0; i < eccBlock; i++) {
          for (j = 0; j < neccBlock1 + neccBlock2; j++) {
            ecc[k++] = stringBuffer[maxLength + i + (j * eccBlock)];
          }
        }
  
        this._stringBuffer = ecc;
      },
  
      _insertAlignments: function() {
        var i, x, y;
        var version = this._version;
        var width = this.width;
  
        if (version > 1) {
          i = Alignment_1.BLOCK[version];
          y = width - 7;
  
          for (;;) {
            x = width - 7;
  
            while (x > i - 3) {
              this._addAlignment(x, y);
  
              if (x < i) {
                break;
              }
  
              x -= i;
            }
  
            if (y <= i + 9) {
              break;
            }
  
            y -= i;
  
            this._addAlignment(6, y);
            this._addAlignment(y, 6);
          }
        }
      },
  
      _insertFinders: function() {
        var i, j, x, y;
        var buffer = this.buffer;
        var width = this.width;
  
        for (i = 0; i < 3; i++) {
          j = 0;
          y = 0;
  
          if (i === 1) {
            j = width - 7;
          }
          if (i === 2) {
            y = width - 7;
          }
  
          buffer[y + 3 + (width * (j + 3))] = 1;
  
          for (x = 0; x < 6; x++) {
            buffer[y + x + (width * j)] = 1;
            buffer[y + (width * (j + x + 1))] = 1;
            buffer[y + 6 + (width * (j + x))] = 1;
            buffer[y + x + 1 + (width * (j + 6))] = 1;
          }
  
          for (x = 1; x < 5; x++) {
            this._setMask(y + x, j + 1);
            this._setMask(y + 1, j + x + 1);
            this._setMask(y + 5, j + x);
            this._setMask(y + x + 1, j + 5);
          }
  
          for (x = 2; x < 4; x++) {
            buffer[y + x + (width * (j + 2))] = 1;
            buffer[y + 2 + (width * (j + x + 1))] = 1;
            buffer[y + 4 + (width * (j + x))] = 1;
            buffer[y + x + 1 + (width * (j + 4))] = 1;
          }
        }
      },
  
      _insertTimingGap: function() {
        var x, y;
        var width = this.width;
  
        for (y = 0; y < 7; y++) {
          this._setMask(7, y);
          this._setMask(width - 8, y);
          this._setMask(7, y + width - 7);
        }
  
        for (x = 0; x < 8; x++) {
          this._setMask(x, 7);
          this._setMask(x + width - 8, 7);
          this._setMask(x, width - 8);
        }
      },
  
      _insertTimingRowAndColumn: function() {
        var x;
        var buffer = this.buffer;
        var width = this.width;
  
        for (x = 0; x < width - 14; x++) {
          if (x & 1) {
            this._setMask(8 + x, 6);
            this._setMask(6, 8 + x);
          } else {
            buffer[8 + x + (width * 6)] = 1;
            buffer[6 + (width * (8 + x))] = 1;
          }
        }
      },
  
      _insertVersion: function() {
        var i, j, x, y;
        var buffer = this.buffer;
        var version = this._version;
        var width = this.width;
  
        if (version > 6) {
          i = Version_1.BLOCK[version - 7];
          j = 17;
  
          for (x = 0; x < 6; x++) {
            for (y = 0; y < 3; y++, j--) {
              if (1 & (j > 11 ? version >> j - 12 : i >> j)) {
                buffer[5 - x + (width * (2 - y + width - 11))] = 1;
                buffer[2 - y + width - 11 + (width * (5 - x))] = 1;
              } else {
                this._setMask(5 - x, 2 - y + width - 11);
                this._setMask(2 - y + width - 11, 5 - x);
              }
            }
          }
        }
      },
  
      _isMasked: function(x, y) {
        var bit = Frame._getMaskBit(x, y);
  
        return this._mask[bit] === 1;
      },
  
      _pack: function() {
        var bit, i, j;
        var k = 1;
        var v = 1;
        var width = this.width;
        var x = width - 1;
        var y = width - 1;
  
        var length = ((this._dataBlock + this._eccBlock) * (this._neccBlock1 + this._neccBlock2)) + this._neccBlock2;
  
        for (i = 0; i < length; i++) {
          bit = this._stringBuffer[i];
  
          for (j = 0; j < 8; j++, bit <<= 1) {
            if (0x80 & bit) {
              this.buffer[x + (width * y)] = 1;
            }
  
            do {
              if (v) {
                x--;
              } else {
                x++;
  
                if (k) {
                  if (y !== 0) {
                    y--;
                  } else {
                    x -= 2;
                    k = !k;
  
                    if (x === 6) {
                      x--;
                      y = 9;
                    }
                  }
                } else if (y !== width - 1) {
                  y++;
                } else {
                  x -= 2;
                  k = !k;
  
                  if (x === 6) {
                    x--;
                    y -= 8;
                  }
                }
              }
  
              v = !v;
            } while (this._isMasked(x, y));
          }
        }
      },
  
      _reverseMask: function() {
        var x, y;
        var width = this.width;
  
        for (x = 0; x < 9; x++) {
          this._setMask(x, 8);
        }
  
        for (x = 0; x < 8; x++) {
          this._setMask(x + width - 8, 8);
          this._setMask(8, x);
        }
  
        for (y = 0; y < 7; y++) {
          this._setMask(8, y + width - 7);
        }
      },
  
      _setMask: function(x, y) {
        var bit = Frame._getMaskBit(x, y);
  
        this._mask[bit] = 1;
      },
  
      _syncMask: function() {
        var x, y;
        var width = this.width;
  
        for (y = 0; y < width; y++) {
          for (x = 0; x <= y; x++) {
            if (this.buffer[x + (width * y)]) {
              this._setMask(x, y);
            }
          }
        }
      }
  
    }, {
  
      _createArray: function(length) {
        var i;
        var array = [];
  
        for (i = 0; i < length; i++) {
          array[i] = 0;
        }
  
        return array;
      },
  
      _getMaskBit: function(x, y) {
        var bit;
  
        if (x > y) {
          bit = x;
          x = y;
          y = bit;
        }
  
        bit = y;
        bit += y * y;
        bit >>= 1;
        bit += x;
  
        return bit;
      },
  
      _modN: function(x) {
        while (x >= 255) {
          x -= 255;
          x = (x >> 8) + (x & 255);
        }
  
        return x;
      },
  

      N1: 3,
      N2: 3,
      N3: 40,
      N4: 10
  
    });
  
    var Frame_1 = Frame;
  
    var ImageRenderer = Renderer_1.extend({

      draw: function() {
        this.element.src = this.qrious.toDataURL();
      },

      reset: function() {
        this.element.src = '';
      },
  

      resize: function() {
        var element = this.element;
  
        element.width = element.height = this.qrious.size;
      }
  
    });
  
    var ImageRenderer_1 = ImageRenderer;
  
    
    var Option = lite.extend(function(name, modifiable, defaultValue, valueTransformer) {
      
      this.name = name;
  
     
      this.modifiable = Boolean(modifiable);
  
     
      this.defaultValue = defaultValue;
  
      this._valueTransformer = valueTransformer;
    }, {
  
      
      transform: function(value) {
        var transformer = this._valueTransformer;
        if (typeof transformer === 'function') {
          return transformer(value, this);
        }
  
        return value;
      }
  
    });
  
    var Option_1 = Option;
  
    
  
    
    var Utilities = lite.extend(null, {
  
     
      abs: function(value) {
        return value != null ? Math.abs(value) : null;
      },
  
     
      hasOwn: function(object, name) {
        return Object.prototype.hasOwnProperty.call(object, name);
      },
  
     
      noop: function() {},
  
      
      toUpperCase: function(string) {
        return string != null ? string.toUpperCase() : null;
      }
  
    });
  
    var Utilities_1 = Utilities;
  
    
    var OptionManager = lite.extend(function(options) {
     
      this.options = {};
  
      options.forEach(function(option) {
        this.options[option.name] = option;
      }, this);
    }, {
  
      
      exists: function(name) {
        return this.options[name] != null;
      },
  
      
      get: function(name, target) {
        return OptionManager._get(this.options[name], target);
      },
  
    
      getAll: function(target) {
        var name;
        var options = this.options;
        var result = {};
  
        for (name in options) {
          if (Utilities_1.hasOwn(options, name)) {
            result[name] = OptionManager._get(options[name], target);
          }
        }
  
        return result;
      },
  
     
      init: function(options, target, changeHandler) {
        if (typeof changeHandler !== 'function') {
          changeHandler = Utilities_1.noop;
        }
  
        var name, option;
  
        for (name in this.options) {
          if (Utilities_1.hasOwn(this.options, name)) {
            option = this.options[name];
  
            OptionManager._set(option, option.defaultValue, target);
            OptionManager._createAccessor(option, target, changeHandler);
          }
        }
  
        this._setAll(options, target, true);
      },
  
     
      set: function(name, value, target) {
        return this._set(name, value, target);
      },
  
     
      setAll: function(options, target) {
        return this._setAll(options, target);
      },
  
      _set: function(name, value, target, allowUnmodifiable) {
        var option = this.options[name];
        if (!option) {
          throw new Error('Invalid option: ' + name);
        }
        if (!option.modifiable && !allowUnmodifiable) {
          throw new Error('Option cannot be modified: ' + name);
        }
  
        return OptionManager._set(option, value, target);
      },
  
      _setAll: function(options, target, allowUnmodifiable) {
        if (!options) {
          return false;
        }
  
        var name;
        var changed = false;
  
        for (name in options) {
          if (Utilities_1.hasOwn(options, name) && this._set(name, options[name], target, allowUnmodifiable)) {
            changed = true;
          }
        }
  
        return changed;
      }
  
    }, {
  
      _createAccessor: function(option, target, changeHandler) {
        var descriptor = {
          get: function() {
            return OptionManager._get(option, target);
          }
        };
  
        if (option.modifiable) {
          descriptor.set = function(value) {
            if (OptionManager._set(option, value, target)) {
              changeHandler(value, option);
            }
          };
        }
  
        Object.defineProperty(target, option.name, descriptor);
      },
  
      _get: function(option, target) {
        return target['_' + option.name];
      },
  
      _set: function(option, value, target) {
        var fieldName = '_' + option.name;
        var oldValue = target[fieldName];
        var newValue = option.transform(value != null ? value : option.defaultValue);
  
        target[fieldName] = newValue;
  
        return newValue !== oldValue;
      }
  
    });
  
    var OptionManager_1 = OptionManager;
  
  
    
    var ServiceManager = lite.extend(function() {
      this._services = {};
    }, {
  
      
      getService: function(name) {
        var service = this._services[name];
        if (!service) {
          throw new Error('Service is not being managed with name: ' + name);
        }
  
        return service;
      },
  
     
      setService: function(name, service) {
        if (this._services[name]) {
          throw new Error('Service is already managed with name: ' + name);
        }
  
        if (service) {
          this._services[name] = service;
        }
      }
  
    });
  
    var ServiceManager_1 = ServiceManager;
  
    var optionManager = new OptionManager_1([
      new Option_1('background', true, 'white'),
      new Option_1('backgroundAlpha', true, 1, Utilities_1.abs),
      new Option_1('element'),
      new Option_1('foreground', true, 'black'),
      new Option_1('foregroundAlpha', true, 1, Utilities_1.abs),
      new Option_1('level', true, 'L', Utilities_1.toUpperCase),
      new Option_1('mime', true, 'image/png'),
      new Option_1('padding', true, null, Utilities_1.abs),
      new Option_1('size', true, 100, Utilities_1.abs),
      new Option_1('value', true, '')
    ]);
    var serviceManager = new ServiceManager_1();
  
    
    var QRious = lite.extend(function(options) {
      optionManager.init(options, this, this.update.bind(this));
  
      var element = optionManager.get('element', this);
      var elementService = serviceManager.getService('element');
      var canvas = element && elementService.isCanvas(element) ? element : elementService.createCanvas();
      var image = element && elementService.isImage(element) ? element : elementService.createImage();
  
      this._canvasRenderer = new CanvasRenderer_1(this, canvas, true);
      this._imageRenderer = new ImageRenderer_1(this, image, image === element);
  
      this.update();
    }, {
  
      
      get: function() {
        return optionManager.getAll(this);
      },
  
      
      set: function(options) {
        if (optionManager.setAll(options, this)) {
          this.update();
        }
      },
  
      
      toDataURL: function(mime) {
        return this.canvas.toDataURL(mime || this.mime);
      },
  
     
      update: function() {
        var frame = new Frame_1({
          level: this.level,
          value: this.value
        });
  
        this._canvasRenderer.render(frame);
        this._imageRenderer.render(frame);
      }
  
    }, {
  
      
      use: function(service) {
        serviceManager.setService(service.getName(), service);
      }
  
    });
  
    Object.defineProperties(QRious.prototype, {
  
      canvas: {
       
        get: function() {
          return this._canvasRenderer.getElement();
        }
      },
  
      image: {
       
        get: function() {
          return this._imageRenderer.getElement();
        }
      }
  
    });
  
    var QRious_1$2 = QRious;
  
    
  
    var index = QRious_1$2;
  
   
    var Service = lite.extend({
  
      
      getName: function() {}
  
    });
  
    var Service_1 = Service;
  
    var ElementService = Service_1.extend({
  
      
      createCanvas: function() {},
  
      
      createImage: function() {},
  
     
      getName: function() {
        return 'element';
      },
  
      
      isCanvas: function(element) {},
  
     
      isImage: function(element) {}
  
    });
  
    var ElementService_1 = ElementService;
  
   
    var BrowserElementService = ElementService_1.extend({
  
     
      createCanvas: function() {
        return document.createElement('canvas');
      },
  
      
      createImage: function() {
        return document.createElement('img');
      },
  
     
      isCanvas: function(element) {
        return element instanceof HTMLCanvasElement;
      },
  
    
      isImage: function(element) {
        return element instanceof HTMLImageElement;
      }
  
    });
  
    var BrowserElementService_1 = BrowserElementService;
  
    index.use(new BrowserElementService_1());
  
    var QRious_1 = index;
  
    return QRious_1;
  
  })));
  
  
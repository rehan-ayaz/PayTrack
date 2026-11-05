/* PayTrack animation engine. Vendor code remains unchanged; selectors use the pt- namespace. */
var SCREEN_VERTEX = "\n    varying vec2 vUv;\n    void main() {\n        vUv = uv;\n        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    }\n",
  SCREEN_FRAGMENT = '\x0a\x20\x20\x20\x20precision\x20highp\x20float;\x0a\x0a\x20\x20\x20\x20uniform\x20sampler2D\x20uTexA;\x0a\x20\x20\x20\x20uniform\x20sampler2D\x20uTexB;\x0a\x20\x20\x20\x20uniform\x20vec2\x20\x20uSizeA;\x0a\x20\x20\x20\x20uniform\x20vec2\x20\x20uSizeB;\x0a\x20\x20\x20\x20uniform\x20vec2\x20\x20uPlane;\x0a\x20\x20\x20\x20uniform\x20float\x20uHasA;\x0a\x20\x20\x20\x20uniform\x20float\x20uHasB;\x0a\x20\x20\x20\x20uniform\x20float\x20uMix;\x20\x20\x20\x20\x20\x20/*\x200\x20=\x20screen\x20A,\x201\x20=\x20screen\x20B\x20*/\x0a\x20\x20\x20\x20uniform\x20vec3\x20\x20uPlate;\x20\x20\x20\x20/*\x20what\x20shows\x20while\x20a\x20screenshot\x20is\x20still\x20loading\x20*/\x0a\x20\x20\x20\x20uniform\x20float\x20uSoft;\x0a\x20\x20\x20\x20uniform\x20float\x20uRadius;\x20\x20\x20/*\x20the\x20display\x27s\x20corner\x20radius,\x20in\x20the\x20same\x20units\x20as\x20uPlane\x20*/\x0a\x20\x20\x20\x20uniform\x20sampler2D\x20uBar;\x20\x20/*\x20the\x20status\x20bar:\x20white\x20glyphs,\x20alpha\x20only\x20*/\x0a\x20\x20\x20\x20uniform\x20float\x20uBarFrac;\x20\x20/*\x20how\x20much\x20of\x20the\x20display\x27s\x20height\x20the\x20bar\x27s\x20strip\x20covers\x20*/\x0a\x20\x20\x20\x20uniform\x20vec3\x20\x20uInkA;\x20\x20\x20\x20\x20/*\x20glyph\x20colour\x20over\x20screen\x20A\x20/\x20B:\x20light\x20on\x20a\x20dark\x20screen\x20*/\x0a\x20\x20\x20\x20uniform\x20vec3\x20\x20uInkB;\x0a\x0a\x20\x20\x20\x20varying\x20vec2\x20vUv;\x0a\x0a\x20\x20\x20\x20/*\x20Signed\x20distance\x20to\x20a\x20rounded\x20rectangle:\x20negative\x20inside.\x20*/\x0a\x20\x20\x20\x20float\x20roundedBox(vec2\x20p,\x20vec2\x20halfSize,\x20float\x20r)\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20q\x20=\x20abs(p)\x20-\x20halfSize\x20+\x20r;\x0a\x20\x20\x20\x20\x20\x20\x20\x20return\x20length(max(q,\x200.0))\x20+\x20min(max(q.x,\x20q.y),\x200.0)\x20-\x20r;\x0a\x20\x20\x20\x20}\x0a\x0a\x20\x20\x20\x20/*\x20Cover-fit,\x20so\x20a\x20screenshot\x20of\x20any\x20aspect\x20fills\x20the\x20display\x20without\x0a\x20\x20\x20\x20\x20\x20\x20stretching.\x20A\x20buyer\x20never\x20has\x20to\x20crop\x20for\x20this.\x20*/\x0a\x20\x20\x20\x20vec2\x20coverUv(vec2\x20uv,\x20vec2\x20img)\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20pa\x20=\x20uPlane.x\x20/\x20uPlane.y;\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20ia\x20=\x20img.x\x20/\x20img.y;\x0a\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20s\x20=\x20(pa\x20>\x20ia)\x20?\x20vec2(1.0,\x20ia\x20/\x20pa)\x20:\x20vec2(pa\x20/\x20ia,\x201.0);\x0a\x20\x20\x20\x20\x20\x20\x20\x20return\x20(uv\x20-\x200.5)\x20*\x20s\x20+\x200.5;\x0a\x20\x20\x20\x20}\x0a\x0a\x20\x20\x20\x20void\x20main()\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20/*\x20The\x20screenshot\x20is\x20clipped\x20to\x20the\x20true\x20curve\x20of\x20the\x20display\x27s\x20corners.\x20*/\x0a\x20\x20\x20\x20\x20\x20\x20\x20if\x20(roundedBox((vUv\x20-\x200.5)\x20*\x20uPlane,\x20uPlane\x20*\x200.5,\x20uRadius)\x20>\x200.0004)\x20discard;\x0a\x20\x20\x20\x20\x20\x20\x20\x20vec3\x20a\x20=\x20uHasA\x20>\x200.5\x20?\x20texture2D(uTexA,\x20coverUv(vUv,\x20uSizeA)).rgb\x20:\x20uPlate;\x0a\x20\x20\x20\x20\x20\x20\x20\x20vec3\x20b\x20=\x20uHasB\x20>\x200.5\x20?\x20texture2D(uTexB,\x20coverUv(vUv,\x20uSizeB)).rgb\x20:\x20uPlate;\x0a\x20\x20\x20\x20\x20\x20\x20\x20/*\x20A\x20soft\x20wipe\x20that\x20climbs\x20from\x20the\x20bottom\x20edge\x20of\x20the\x20display.\x20*/\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20m\x20=\x20smoothstep(0.0,\x20uSoft,\x20uMix\x20*\x20(1.0\x20+\x20uSoft)\x20-\x20vUv.y);\x0a\x20\x20\x20\x20\x20\x20\x20\x20vec3\x20col\x20=\x20mix(a,\x20b,\x20m);\x0a\x20\x20\x20\x20\x20\x20\x20\x20/*\x20The\x20status\x20bar\x20is\x20drawn\x20here,\x20not\x20baked\x20into\x20the\x20screenshot,\x20so\x20it\x20is\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20always\x20crisp\x20and\x20always\x20the\x20right\x20colour\x20for\x20what\x20is\x20under\x20it.\x20The\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20sample\x20is\x20taken\x20everywhere\x20and\x20masked,\x20to\x20keep\x20the\x20derivatives\x20valid.\x20*/\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20barTop\x20=\x201.0\x20-\x20uBarFrac;\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20bar\x20=\x20texture2D(uBar,\x20vec2(vUv.x,\x20clamp((vUv.y\x20-\x20barTop)\x20/\x20uBarFrac,\x200.0,\x201.0))).a;\x0a\x20\x20\x20\x20\x20\x20\x20\x20bar\x20*=\x20step(barTop,\x20vUv.y);\x0a\x20\x20\x20\x20\x20\x20\x20\x20/*\x20Through\x20a\x20wipe\x20the\x20glyphs\x20switch\x20colour\x20once,\x20together,\x20when\x20the\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20backdrop\x20passes\x20mid-tone,\x20rather\x20than\x20blending\x20to\x20a\x20grey\x20that\x20would\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20sit\x20on\x20a\x20grey.\x20*/\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20mBar\x20=\x20smoothstep(0.0,\x20uSoft,\x20uMix\x20*\x20(1.0\x20+\x20uSoft)\x20-\x20(1.0\x20-\x20uBarFrac\x20*\x200.5));\x0a\x20\x20\x20\x20\x20\x20\x20\x20col\x20=\x20mix(col,\x20mix(uInkA,\x20uInkB,\x20smoothstep(0.42,\x200.58,\x20mBar)),\x20bar);\x0a\x20\x20\x20\x20\x20\x20\x20\x20gl_FragColor\x20=\x20vec4(col,\x201.0);\x0a\x20\x20\x20\x20}\x0a';
function clamp(_0x5814ba, _0x266fee, _0x2c0bce) {
  var _0x883ae5 = {};
  _0x883ae5["uasnP"] = function (_0x56dd42, _0x5d9ca6) {
    return _0x56dd42 > _0x5d9ca6;
  };
  var _0x5eca2d = _0x883ae5;
  return _0x5814ba < _0x266fee ? _0x266fee : _0x5eca2d["uasnP"](_0x5814ba, _0x2c0bce) ? _0x2c0bce : _0x5814ba;
}
function lerp(_0x32ae33, _0x334eba, _0x449509) {
  var _0x14bbe7 = {};
  _0x14bbe7['uunwE'] = function (_0x20f8b6, _0x53f1a4) {
    return _0x20f8b6 * _0x53f1a4;
  }, _0x14bbe7['gRxMP'] = function (_0x28c67f, _0x304353) {
    return _0x28c67f - _0x304353;
  };
  var _0x47cad8 = _0x14bbe7;
  return _0x32ae33 + _0x47cad8["uunwE"](_0x47cad8["gRxMP"](_0x334eba, _0x32ae33), _0x449509);
}
function smoothstep(_0x316d6b, _0x2d81c4, _0x4d6f29) {
  var _0x599496 = {};
  _0x599496["StEOX"] = function (_0x92ddab, _0x1b6fbc) {
    return _0x92ddab / _0x1b6fbc;
  }, _0x599496['XTdQk'] = function (_0x1b836e, _0x42e346) {
    return _0x1b836e - _0x42e346;
  }, _0x599496["BAkNe"] = function (_0x164206, _0x4c99a9) {
    return _0x164206 * _0x4c99a9;
  };
  var _0x193d1a = _0x599496,
    _0x4f78c9 = clamp(_0x193d1a['StEOX'](_0x193d1a["XTdQk"](_0x4d6f29, _0x316d6b), _0x2d81c4 - _0x316d6b), 0x0, 0x1);
  return _0x193d1a["BAkNe"](_0x4f78c9, _0x4f78c9) * _0x193d1a["XTdQk"](0x3, 0x2 * _0x4f78c9);
}
function num(_0x387492, _0x21a1a2) {
  var _0x163347 = {
      'jRWom': function (_0x2db2fd, _0x99922a) {
        return _0x2db2fd(_0x99922a);
      },
      'rKrqK': function (_0x51fab4, _0x50abc4) {
        return _0x51fab4(_0x50abc4);
      }
    },
    _0x410746 = _0x163347["jRWom"](parseFloat, _0x387492);
  return _0x163347["rKrqK"](isNaN, _0x410746) ? _0x21a1a2 : _0x410746;
}
function hasWebGL() {
  var _0x59448b = {};
  _0x59448b["NwcOW"] = "webgl2", _0x59448b['KHsJC'] = "canvas";
  var _0x505753 = _0x59448b;
  try {
    var _0xdf1e81 = "4|0|2|1|5|3"['split']('|'),
      _0x2625a3 = 0x0;
    while (!![]) {
      switch (_0xdf1e81[_0x2625a3++]) {
        case '0':
          var _0x5715e1 = _0x2fa5d9['getContext'](_0x505753['NwcOW']);
          continue;
        case '1':
          var _0x54cf8b = _0x5715e1["getExtension"]("WEBGL_lose_context");
          continue;
        case '2':
          if (!_0x5715e1) return ![];
          continue;
        case '3':
          return !![];
        case '4':
          var _0x2fa5d9 = document["createElement"](_0x505753["KHsJC"]);
          continue;
        case '5':
          if (_0x54cf8b) _0x54cf8b['loseContext']();
          continue;
      }
      break;
    }
  } catch (_0x26e66d) {
    return ![];
  }
}
function whenImageReady(_0x16299c) {
  var _0x28b0b0 = {
    'diUkV': function (_0x18838b, _0x322e89) {
      return _0x18838b(_0x322e89);
    }
  };
  return new Promise(function (_0x5e0cb9) {
    var _0x1f98c1 = {
      'PDsAq': function (_0x15cc7e, _0x457e76) {
        return _0x28b0b0['diUkV'](_0x15cc7e, _0x457e76);
      }
    };
    if (!_0x16299c) {
      _0x5e0cb9(null);
      return;
    }
    if (_0x16299c['complete'] && _0x16299c["naturalWidth"]) {
      _0x28b0b0['diUkV'](_0x5e0cb9, _0x16299c);
      return;
    }
    var _0x2741fb = {};
    _0x2741fb["once"] = !![], _0x16299c["addEventListener"]('load', function () {
      _0x28b0b0["diUkV"](_0x5e0cb9, _0x16299c);
    }, _0x2741fb);
    var _0x26bb8e = {};
    _0x26bb8e["once"] = !![], _0x16299c['addEventListener']("error", function () {
      _0x1f98c1['PDsAq'](_0x5e0cb9, null);
    }, _0x26bb8e);
  });
}
function roundedRectShape(_0x415e33, _0x30a3df, _0x5c4b78) {
  var _0x17c432 = {};
  _0x17c432['mUkcG'] = function (_0x43b6ca, _0x1f6c0c) {
    return _0x43b6ca + _0x1f6c0c;
  }, _0x17c432["qoISM"] = function (_0x1902cd, _0x595d89) {
    return _0x1902cd + _0x595d89;
  }, _0x17c432['zAWjb'] = function (_0x5302b5, _0x4be087) {
    return _0x5302b5 + _0x4be087;
  }, _0x17c432['gzUUz'] = function (_0x8f65f6, _0x4f2841) {
    return _0x8f65f6 - _0x4f2841;
  }, _0x17c432['MtXqd'] = function (_0x33fff4, _0x4f022b) {
    return _0x33fff4 * _0x4f022b;
  };
  var _0x4b5a72 = _0x17c432,
    _0x5b30d6 = new THREE['Shape'](),
    _0x4fb289 = -_0x415e33 / 0x2,
    _0x339309 = -_0x30a3df / 0x2;
  return _0x5b30d6["moveTo"](_0x4fb289 + _0x5c4b78, _0x339309), _0x5b30d6['lineTo'](_0x4fb289 + _0x415e33 - _0x5c4b78, _0x339309), _0x5b30d6['absarc'](_0x4fb289 + _0x415e33 - _0x5c4b78, _0x339309 + _0x5c4b78, _0x5c4b78, -Math['PI'] / 0x2, 0x0, ![]), _0x5b30d6['lineTo'](_0x4fb289 + _0x415e33, _0x4b5a72['mUkcG'](_0x339309, _0x30a3df) - _0x5c4b78), _0x5b30d6['absarc'](_0x4b5a72['qoISM'](_0x4fb289, _0x415e33) - _0x5c4b78, _0x339309 + _0x30a3df - _0x5c4b78, _0x5c4b78, 0x0, Math['PI'] / 0x2, ![]), _0x5b30d6['lineTo'](_0x4b5a72["mUkcG"](_0x4fb289, _0x5c4b78), _0x339309 + _0x30a3df), _0x5b30d6['absarc'](_0x4b5a72["zAWjb"](_0x4fb289, _0x5c4b78), _0x4b5a72["gzUUz"](_0x339309 + _0x30a3df, _0x5c4b78), _0x5c4b78, Math['PI'] / 0x2, Math['PI'], ![]), _0x5b30d6["lineTo"](_0x4fb289, _0x339309 + _0x5c4b78), _0x5b30d6["absarc"](_0x4fb289 + _0x5c4b78, _0x4b5a72["mUkcG"](_0x339309, _0x5c4b78), _0x5c4b78, Math['PI'], _0x4b5a72['MtXqd'](Math['PI'], 1.5), ![]), _0x5b30d6;
}
function buildEnvironment(_0x479fa5, _0x34c328) {
  var _0x4625ec = {
      'eMZin': function (_0x3a8cea, _0x1ac5e1, _0x215f84, _0xcd027a, _0x2d3d34, _0x60c6ca, _0x59fedc, _0x316da8) {
        return _0x3a8cea(_0x1ac5e1, _0x215f84, _0xcd027a, _0x2d3d34, _0x60c6ca, _0x59fedc, _0x316da8);
      },
      'ngoUx': function (_0x3a5057, _0x54141f, _0x2d5153, _0x323dc4, _0x44765c, _0x52e446, _0x1ce514, _0x2b5311) {
        return _0x3a5057(_0x54141f, _0x2d5153, _0x323dc4, _0x44765c, _0x52e446, _0x1ce514, _0x2b5311);
      },
      'IsNGo': function (_0x563b41, _0xbe9694, _0x585214, _0x35afc0, _0x38d80d, _0x51f3fe, _0x5bc6d5, _0x5753d0) {
        return _0x563b41(_0xbe9694, _0x585214, _0x35afc0, _0x38d80d, _0x51f3fe, _0x5bc6d5, _0x5753d0);
      }
    },
    _0x85f2d7 = new THREE["PMREMGenerator"](_0x479fa5),
    _0x5f06f8 = new THREE['Scene'](),
    _0x591459 = [],
    _0x3c91c7 = new THREE["Mesh"](new THREE["BoxGeometry"](0x18, 0x18, 0x18), new THREE['MeshBasicMaterial']({
      'color': 0x14232b,
      'side': THREE["BackSide"]
    }));
  _0x5f06f8["add"](_0x3c91c7), _0x591459["push"](_0x3c91c7);
  function _0x14e4b9(_0x29ce7e, _0x155c8a, _0x506b25, _0xedb3f4, _0x26b343, _0x3f0237, _0x25150d) {
    var _0x1c2a76 = new THREE['MeshBasicMaterial']({
        'color': new THREE["Color"](_0x506b25)['multiplyScalar'](_0xedb3f4),
        'side': THREE['DoubleSide']
      }),
      _0x156747 = new THREE['Mesh'](new THREE['PlaneGeometry'](_0x29ce7e, _0x155c8a), _0x1c2a76);
    _0x156747['position']['set'](_0x26b343, _0x3f0237, _0x25150d), _0x156747['lookAt'](0x0, 0x0, 0x0), _0x5f06f8["add"](_0x156747), _0x591459["push"](_0x156747);
  }
  _0x4625ec["eMZin"](_0x14e4b9, 0xe, 0x8, 0xfff3e6, 0x6, 0x0, 0xa, 0x2), _0x14e4b9(0x4, 0xc, 0xffffff, 3.2, -0xa, 0x3, 0x3), _0x4625ec['ngoUx'](_0x14e4b9, 0x1, 0x10, 0xffffff, 0xa, -6.5, 0x0, 0x8), _0x4625ec["ngoUx"](_0x14e4b9, 0x1, 0x10, 0xffffff, 0x9, 6.5, 0x0, 0x8), _0x14e4b9(0x4, 0xf, 0xffe4ec, 0x4, 0xa, 0x0, -0x1), _0x4625ec['IsNGo'](_0x14e4b9, 0x10, 0x4, _0x34c328, 0x3, 0x0, -0x9, 0x4), _0x14e4b9(0xa, 0xa, 0xcfe6ff, 2.5, 0x0, 0x2, -0xa), _0x4625ec["ngoUx"](_0x14e4b9, 0x14, 0x1e, 0xffffff, 0.55, 0x4, 0x6, 0xe);
  var _0x5a67e7 = _0x85f2d7['fromScene'](_0x5f06f8, 0.035);
  return _0x85f2d7['dispose'](), _0x591459["forEach"](function (_0x3cd578) {
    _0x3cd578["geometry"]["dispose"](), _0x3cd578['material']["dispose"]();
  }), _0x5a67e7;
}
function arcPoints(_0x132e6e, _0x38785d, _0x581f5e, _0x18064e, _0x4f2361, _0xa2c62d) {
  var _0xc3343c = {};
  _0xc3343c['OsEOE'] = function (_0x1d53d7, _0xc12963) {
    return _0x1d53d7 + _0xc12963;
  }, _0xc3343c["yoljL"] = function (_0x55b51d, _0x15f311) {
    return _0x55b51d - _0x15f311;
  }, _0xc3343c["QCBTS"] = function (_0x314762, _0x3d127d) {
    return _0x314762 * _0x3d127d;
  }, _0xc3343c['idIeZ'] = function (_0x5e703e, _0x5b7a71) {
    return _0x5e703e + _0x5b7a71;
  };
  var _0x53fbb5 = _0xc3343c,
    _0x63faad = [];
  for (var _0x4b22bb = 0x0; _0x4b22bb <= _0xa2c62d; _0x4b22bb++) {
    var _0x4b3146 = _0x53fbb5['OsEOE'](_0x18064e, _0x53fbb5["yoljL"](_0x4f2361, _0x18064e) * _0x4b22bb / _0xa2c62d);
    _0x63faad["push"]([_0x132e6e + _0x53fbb5["QCBTS"](_0x581f5e, Math["cos"](_0x4b3146)), _0x53fbb5['idIeZ'](_0x38785d, _0x581f5e * Math['sin'](_0x4b3146))]);
  }
  return _0x63faad;
}
function latheZ(_0x1e3084, _0x6acb0e) {
  var _0x5da2b4 = _0x1e3084["map"](function (_0x5d2aee) {
      return new THREE["Vector2"](_0x5d2aee[0x0], _0x5d2aee[0x1]);
    }),
    _0x3ce0ab = new THREE["LatheGeometry"](_0x5da2b4, _0x6acb0e);
  return _0x3ce0ab["rotateX"](Math['PI'] / 0x2), _0x3ce0ab;
}
function makeLensTexture() {
  var _0x5dbda1 = {};
  _0x5dbda1['vjDdK'] = "#0c1112", _0x5dbda1['eQxzK'] = '3|4|2|1|0', _0x5dbda1["Mzhtf"] = '#000000', _0x5dbda1['OBBOo'] = 'canvas', _0x5dbda1["DLUEM"] = 'rgba(200,\x20130,\x2060,\x200)', _0x5dbda1['zJLKz'] = 'rgba(60,\x20150,\x20120,\x200)', _0x5dbda1["zZlNn"] = function (_0x8cbfe2, _0xcc85de) {
    return _0x8cbfe2 * _0xcc85de;
  }, _0x5dbda1['owxIB'] = function (_0x4dec73, _0x5d8f9c) {
    return _0x4dec73 * _0x5d8f9c;
  }, _0x5dbda1['MHAbj'] = function (_0x223e1f, _0x7bdeb4) {
    return _0x223e1f * _0x7bdeb4;
  }, _0x5dbda1['xwbZA'] = function (_0x479801, _0x58eeff) {
    return _0x479801 * _0x58eeff;
  }, _0x5dbda1['laxFz'] = "rgba(120, 140, 150, 0.22)", _0x5dbda1["BEgWD"] = 'rgba(90,\x20120,\x20130,\x200.12)', _0x5dbda1["QhRjN"] = function (_0x237ac7, _0x16bc15) {
    return _0x237ac7 * _0x16bc15;
  }, _0x5dbda1["EGzPZ"] = function (_0x4a81f8, _0x42f51a) {
    return _0x4a81f8 * _0x42f51a;
  };
  var _0x886175 = _0x5dbda1,
    _0x288051 = '6|31|11|24|0|17|5|3|21|27|2|1|28|26|8|14|10|22|4|18|15|7|19|12|13|25|9|20|29|23|16|30'["split"]('|'),
    _0x317684 = 0x0;
  while (!![]) {
    switch (_0x288051[_0x317684++]) {
      case '0':
        _0x41e75d["height"] = _0x31ca00;
        continue;
      case '1':
        _0x235a82['addColorStop'](0.68, _0x886175['vjDdK']);
        continue;
      case '2':
        _0x235a82["addColorStop"](0.3, '#0a0f10');
        continue;
      case '3':
        var _0x235a82 = _0x2d9531["createRadialGradient"](_0x47cf86, _0x47cf86, 0x0, _0x47cf86, _0x47cf86, _0x47cf86);
        continue;
      case '4':
        _0x40fcf7['addColorStop'](0x0, "rgba(60, 150, 120, 0.2)");
        continue;
      case '5':
        var _0x47cf86 = _0x31ca00 / 0x2;
        continue;
      case '6':
        var _0x45436c = {};
        _0x45436c['kyNaO'] = _0x886175["eQxzK"], _0x45436c['Acljd'] = function (_0x3ba0ac, _0x5a40a4) {
          return _0x3ba0ac * _0x5a40a4;
        };
        var _0x303d55 = _0x45436c;
        continue;
      case '7':
        _0x2d9531['fillRect'](0x0, 0x0, _0x31ca00, _0x31ca00);
        continue;
      case '8':
        _0x235a82['addColorStop'](0x1, _0x886175['Mzhtf']);
        continue;
      case '9':
        _0x2d9531["fillRect"](0x0, 0x0, _0x31ca00, _0x31ca00);
        continue;
      case '10':
        _0x2d9531["fillRect"](0x0, 0x0, _0x31ca00, _0x31ca00);
        continue;
      case '11':
        var _0x41e75d = document["createElement"](_0x886175['OBBOo']);
        continue;
      case '12':
        _0x3a8dd3['addColorStop'](0x0, "rgba(200, 130, 60, 0.14)");
        continue;
      case '13':
        _0x3a8dd3["addColorStop"](0x1, _0x886175["DLUEM"]);
        continue;
      case '14':
        _0x2d9531['fillStyle'] = _0x235a82;
        continue;
      case '15':
        _0x2d9531["fillStyle"] = _0x40fcf7;
        continue;
      case '16':
        _0x5b0f10['anisotropy'] = 0x4;
        continue;
      case '17':
        var _0x2d9531 = _0x41e75d["getContext"]('2d');
        continue;
      case '18':
        _0x40fcf7['addColorStop'](0x1, _0x886175['zJLKz']);
        continue;
      case '19':
        var _0x3a8dd3 = _0x2d9531["createRadialGradient"](_0x886175['zZlNn'](_0x31ca00, 0.62), _0x886175["owxIB"](_0x31ca00, 0.64), 0x0, _0x886175["zZlNn"](_0x31ca00, 0.62), _0x886175["MHAbj"](_0x31ca00, 0.64), _0x886175['xwbZA'](_0x31ca00, 0.16));
        continue;
      case '20':
        [[0.22, _0x886175['laxFz'], 1.5], [0.46, _0x886175['BEgWD'], 1.5], [0.68, 'rgba(140,\x20150,\x20160,\x200.16)', 1.5], [0.78, 'rgba(160,\x20170,\x20180,\x200.12)', 0x1]]['forEach'](function (_0x203346) {
          var _0x25924e = _0x303d55["kyNaO"]['split']('|'),
            _0x1841c3 = 0x0;
          while (!![]) {
            switch (_0x25924e[_0x1841c3++]) {
              case '0':
                _0x2d9531["stroke"]();
                continue;
              case '1':
                _0x2d9531["lineWidth"] = _0x203346[0x2];
                continue;
              case '2':
                _0x2d9531["strokeStyle"] = _0x203346[0x1];
                continue;
              case '3':
                _0x2d9531["beginPath"]();
                continue;
              case '4':
                _0x2d9531['arc'](_0x47cf86, _0x47cf86, _0x303d55['Acljd'](_0x203346[0x0], _0x47cf86), 0x0, _0x303d55["Acljd"](Math['PI'], 0x2));
                continue;
            }
            break;
          }
        });
        continue;
      case '21':
        _0x235a82['addColorStop'](0x0, "#010203");
        continue;
      case '22':
        var _0x40fcf7 = _0x2d9531['createRadialGradient'](_0x886175["owxIB"](_0x31ca00, 0.4), _0x886175["QhRjN"](_0x31ca00, 0.38), 0x0, _0x31ca00 * 0.4, _0x886175["EGzPZ"](_0x31ca00, 0.38), _0x886175["owxIB"](_0x31ca00, 0.3));
        continue;
      case '23':
        if (THREE['SRGBColorSpace'] !== undefined) _0x5b0f10['colorSpace'] = THREE['SRGBColorSpace'];
        continue;
      case '24':
        _0x41e75d['width'] = _0x31ca00;
        continue;
      case '25':
        _0x2d9531["fillStyle"] = _0x3a8dd3;
        continue;
      case '26':
        _0x235a82["addColorStop"](0.8, _0x886175['Mzhtf']);
        continue;
      case '27':
        _0x235a82["addColorStop"](0.22, '#020304');
        continue;
      case '28':
        _0x235a82['addColorStop'](0.76, '#050708');
        continue;
      case '29':
        var _0x5b0f10 = new THREE["CanvasTexture"](_0x41e75d);
        continue;
      case '30':
        return _0x5b0f10;
      case '31':
        var _0x31ca00 = 0x100;
        continue;
    }
    break;
  }
}
function roundRectPath(_0x3078c9, _0x4941a3, _0x1c6772, _0x1fedb5, _0xdce30c, _0x591970) {
  var _0x3405ff = {};
  _0x3405ff["SuiRe"] = "6|5|0|7|4|1|3|2", _0x3405ff['xbAVS'] = function (_0x3d117c, _0x311e10) {
    return _0x3d117c + _0x311e10;
  }, _0x3405ff['pVpjL'] = function (_0x314886, _0x2350ae) {
    return _0x314886 + _0x2350ae;
  };
  var _0x4e32b1 = _0x3405ff,
    _0x4f62ce = _0x4e32b1['SuiRe']["split"]('|'),
    _0x5252ee = 0x0;
  while (!![]) {
    switch (_0x4f62ce[_0x5252ee++]) {
      case '0':
        _0x3078c9['moveTo'](_0x4e32b1["xbAVS"](_0x4941a3, _0x591970), _0x1c6772);
        continue;
      case '1':
        _0x3078c9['arcTo'](_0x4941a3, _0x4e32b1['xbAVS'](_0x1c6772, _0xdce30c), _0x4941a3, _0x1c6772, _0x591970);
        continue;
      case '2':
        _0x3078c9['closePath']();
        continue;
      case '3':
        _0x3078c9["arcTo"](_0x4941a3, _0x1c6772, _0x4941a3 + _0x1fedb5, _0x1c6772, _0x591970);
        continue;
      case '4':
        _0x3078c9["arcTo"](_0x4e32b1['xbAVS'](_0x4941a3, _0x1fedb5), _0x4e32b1['pVpjL'](_0x1c6772, _0xdce30c), _0x4941a3, _0x1c6772 + _0xdce30c, _0x591970);
        continue;
      case '5':
        _0x3078c9['beginPath']();
        continue;
      case '6':
        _0x591970 = Math['min'](_0x591970, _0x1fedb5 / 0x2, _0xdce30c / 0x2);
        continue;
      case '7':
        _0x3078c9['arcTo'](_0x4e32b1["xbAVS"](_0x4941a3, _0x1fedb5), _0x1c6772, _0x4941a3 + _0x1fedb5, _0x1c6772 + _0xdce30c, _0x591970);
        continue;
    }
    break;
  }
}
var STATUS_CLUSTER_PT = 71.35;
function drawStatusBar(_0x37a392, _0x186cc7) {
  var ctx = _0x37a392.getContext('2d');
  ctx.clearRect(0, 0, _0x37a392.width, _0x37a392.height);
  return;
  var _0x1bbe7b = {
      'ljXWe': function (_0x56588a, _0x4fd952) {
        return _0x56588a * _0x4fd952;
      },
      'ujUnE': function (_0x5303d2, _0x3cccf7) {
        return _0x5303d2 / _0x3cccf7;
      },
      'mxIjy': "#fff",
      'Parhr': function (_0x493794, _0x156a86) {
        return _0x493794 + _0x156a86;
      },
      'NjPkQ': "600 ",
      'KBPpw': "center",
      'osTfc': function (_0x55a920, _0x1ce40b) {
        return _0x55a920 / _0x1ce40b;
      },
      'jEthp': function (_0x2c7f2c, _0x997eff) {
        return _0x2c7f2c * _0x997eff;
      },
      'yXAaQ': function (_0x134275, _0x331f39) {
        return _0x134275 / _0x331f39;
      },
      'CYvlZ': function (_0x37ddaa, _0x5795cd) {
        return _0x37ddaa / _0x5795cd;
      },
      'Ddhrg': function (_0x26070f, _0x254d1e) {
        return _0x26070f * _0x254d1e;
      },
      'Fltkn': function (_0x37fd25, _0x434efe) {
        return _0x37fd25 * _0x434efe;
      },
      'jUVXM': function (_0x575ee5, _0x3fd1b3) {
        return _0x575ee5 < _0x3fd1b3;
      },
      'zyIDA': function (_0x4ea735, _0x1cde5c, _0x346b35, _0x4a8e96, _0x5f2c14, _0x233aef, _0x35f72d) {
        return _0x4ea735(_0x1cde5c, _0x346b35, _0x4a8e96, _0x5f2c14, _0x233aef, _0x35f72d);
      },
      'cxpvA': function (_0x239d14, _0x4a9915) {
        return _0x239d14 * _0x4a9915;
      },
      'INYCb': function (_0x1870c0, _0x42206b) {
        return _0x1870c0 + _0x42206b;
      }
    },
    _0x2c7fe9 = _0x37a392["getContext"]('2d'),
    _0x181868 = _0x1bbe7b['ujUnE'](_0x37a392['width'], _0x186cc7['sw']),
    _0x3bf844 = _0x186cc7['sw'] / 0x189,
    _0x306ed0 = _0x1bbe7b['ljXWe'](_0x186cc7['rowY'], _0x181868);
  _0x2c7fe9['clearRect'](0x0, 0x0, _0x37a392['width'], _0x37a392["height"]), _0x2c7fe9['fillStyle'] = "#fff", _0x2c7fe9['strokeStyle'] = _0x1bbe7b["mxIjy"];
  var _0x48ae18 = 0x11 * _0x3bf844 * _0x181868;
  _0x2c7fe9["font"] = _0x1bbe7b["Parhr"](_0x1bbe7b["NjPkQ"], _0x48ae18) + 'px\x20\x22Plus\x20Jakarta\x20Sans\x22,\x20\x22Inter\x22,\x20-apple-system,\x20\x22SF\x20Pro\x20Text\x22,\x20system-ui,\x20\x22Segoe\x20UI\x22,\x20Roboto,\x20sans-serif', _0x2c7fe9["textAlign"] = _0x1bbe7b['KBPpw'], _0x2c7fe9["textBaseline"] = "alphabetic";
  var _0x5941f1 = _0x2c7fe9['measureText'](_0x186cc7['time']),
    _0x4e8bc7 = _0x5941f1["actualBoundingBoxAscent"] || _0x48ae18 * 0.72,
    _0x59968d = _0x5941f1['actualBoundingBoxDescent'] || 0x0,
    _0x3d985b = _0x1bbe7b["ujUnE"](_0x186cc7['sw'], 0x2) - _0x186cc7["islandW"] / 0x2,
    _0x595d74 = _0x1bbe7b['Parhr'](_0x186cc7['sw'] / 0x2, _0x1bbe7b['osTfc'](_0x186cc7["islandW"], 0x2));
  _0x2c7fe9['fillText'](_0x186cc7["time"], _0x1bbe7b['jEthp']((_0x186cc7['radius'] + _0x3d985b) / 0x2, _0x181868), _0x1bbe7b["Parhr"](_0x306ed0, _0x1bbe7b['yXAaQ'](_0x4e8bc7 - _0x59968d, 0x2)));
  var _0x49df06 = _0x1bbe7b["osTfc"](_0x1bbe7b['Parhr'](_0x595d74, _0x186cc7['sw'] - _0x186cc7['radius']), 0x2);
  _0x2c7fe9["save"](), _0x2c7fe9["translate"](_0x49df06 * _0x181868 - _0x1bbe7b["CYvlZ"](_0x1bbe7b["Ddhrg"](STATUS_CLUSTER_PT, _0x3bf844) * _0x181868, 0x2), _0x306ed0), _0x2c7fe9['scale'](_0x3bf844 * _0x181868, _0x1bbe7b['Fltkn'](_0x3bf844, _0x181868));
  var _0xf2e100 = [4.6, 0x7, 9.5, 0xc];
  for (var _0x39d0f6 = 0x0; _0x1bbe7b["jUVXM"](_0x39d0f6, 0x4); _0x39d0f6++) {
    _0x1bbe7b['zyIDA'](roundRectPath, _0x2c7fe9, _0x39d0f6 * 4.75, 0x6 - _0xf2e100[_0x39d0f6], 0x3, _0xf2e100[_0x39d0f6], 0x1), _0x2c7fe9['fill']();
  }
  var _0x2c6d4d = _0x1bbe7b['Parhr'](22.25, 8.5);
  _0x2c7fe9["lineCap"] = "butt", [[9.2, 0xc], [5.5, 8.3]]['forEach'](function (_0x3a2748) {
    _0x2c7fe9['beginPath'](), _0x2c7fe9["arc"](_0x2c6d4d, 0x6, (_0x3a2748[0x0] + _0x3a2748[0x1]) / 0x2, _0x1bbe7b["ljXWe"](-Math['PI'], 0.75), _0x1bbe7b["ljXWe"](-Math['PI'], 0.25)), _0x2c7fe9["lineWidth"] = _0x3a2748[0x1] - _0x3a2748[0x0], _0x2c7fe9["stroke"]();
  }), _0x2c7fe9["beginPath"](), _0x2c7fe9['moveTo'](_0x2c6d4d, 0x6), _0x2c7fe9['arc'](_0x2c6d4d, 0x6, 3.7, -Math['PI'] * 0.75, _0x1bbe7b['cxpvA'](-Math['PI'], 0.25)), _0x2c7fe9["closePath"](), _0x2c7fe9['fill']();
  var _0x1b94f0 = 44.25;
  _0x2c7fe9["globalAlpha"] = 0.42, roundRectPath(_0x2c7fe9, _0x1b94f0 + 0.5, -5.5, 0x18, 0xb, 3.2), _0x2c7fe9["lineWidth"] = 0x1, _0x2c7fe9["stroke"](), _0x1bbe7b['zyIDA'](roundRectPath, _0x2c7fe9, _0x1bbe7b["INYCb"](_0x1b94f0, 25.7), -0x2, 1.4, 0x4, 0.7), _0x2c7fe9['fill'](), _0x2c7fe9['globalAlpha'] = 0x1, roundRectPath(_0x2c7fe9, _0x1bbe7b['Parhr'](_0x1b94f0, 0x2), -3.5, 16.6, 0x7, 1.9), _0x2c7fe9['fill'](), _0x2c7fe9["restore"]();
}
function screenTone(_0x4124b3, _0x50cca7) {
  var _0x258e48 = {};
  _0x258e48['BPxrt'] = 'dark', _0x258e48["GHqof"] = function (_0x5de427, _0x58189e) {
    return _0x5de427 === _0x58189e;
  }, _0x258e48['wzJWL'] = '3|6|8|1|2|0|4|7|5', _0x258e48["uCgUL"] = function (_0x32f10b, _0x2d4893) {
    return _0x32f10b < _0x2d4893;
  }, _0x258e48["siZzK"] = function (_0x41b820, _0x443498) {
    return _0x41b820 / _0x443498;
  }, _0x258e48['yaADL'] = function (_0x866eaf, _0x1afa28) {
    return _0x866eaf + _0x1afa28;
  }, _0x258e48["YwFgw"] = function (_0x444231, _0x1aa3bc) {
    return _0x444231 * _0x1aa3bc;
  }, _0x258e48["zHwQr"] = function (_0x55eff3, _0x215f71) {
    return _0x55eff3 * _0x215f71;
  }, _0x258e48["VFyDO"] = function (_0x2a8345, _0x4e7e86) {
    return _0x2a8345 + _0x4e7e86;
  };
  var _0x16ca1b = _0x258e48;
  if (_0x50cca7 === _0x16ca1b['BPxrt'] || _0x16ca1b['GHqof'](_0x50cca7, 'light')) return _0x50cca7;
  try {
    var _0x1931a1 = _0x16ca1b['wzJWL']["split"]('|'),
      _0x515943 = 0x0;
    while (!![]) {
      switch (_0x1931a1[_0x515943++]) {
        case '0':
          var _0x406da9 = _0x4ea417['getImageData'](0x0, 0x0, 0x20, 0x4)['data'];
          continue;
        case '1':
          var _0x191fba = {};
          _0x191fba['willReadFrequently'] = !![];
          var _0x4ea417 = _0x573933["getContext"]('2d', _0x191fba);
          continue;
        case '2':
          _0x4ea417["drawImage"](_0x4124b3, 0x0, 0x0, _0x4124b3['naturalWidth'], _0x4124b3["naturalHeight"] * 0.06, 0x0, 0x0, 0x20, 0x4);
          continue;
        case '3':
          var _0x573933 = document["createElement"]('canvas');
          continue;
        case '4':
          var _0x21f907 = 0x0;
          continue;
        case '5':
          return _0x16ca1b['uCgUL'](_0x16ca1b['siZzK'](_0x21f907 / (_0x406da9["length"] / 0x4), 0xff), 0.5) ? 'dark' : "light";
        case '6':
          _0x573933["width"] = 0x20;
          continue;
        case '7':
          for (var _0x2515e3 = 0x0; _0x2515e3 < _0x406da9["length"]; _0x2515e3 += 0x4) _0x21f907 += _0x16ca1b["yaADL"](_0x16ca1b["YwFgw"](0.2126, _0x406da9[_0x2515e3]), 0.7152 * _0x406da9[_0x2515e3 + 0x1]) + _0x16ca1b["zHwQr"](0.0722, _0x406da9[_0x16ca1b['VFyDO'](_0x2515e3, 0x2)]);
          continue;
        case '8':
          _0x573933['height'] = 0x4;
          continue;
      }
      break;
    }
  } catch (_0x26f11f) {
    return "light";
  }
}
function makeGrainTexture() {
  var _0x338484 = {};
  _0x338484['BcTXF'] = "13|5|2|4|12|7|11|9|10|8|3|14|1|6|0", _0x338484["MXQAJ"] = function (_0x27f99d, _0x5b0c00) {
    return _0x27f99d < _0x5b0c00;
  }, _0x338484['RCPYa'] = '6|4|5|2|1|0|3', _0x338484["fNehB"] = function (_0x1dd29d, _0x5aef20) {
    return _0x1dd29d * _0x5aef20;
  }, _0x338484["WrVfS"] = function (_0x2f7231, _0x215e28) {
    return _0x2f7231 + _0x215e28;
  }, _0x338484["UQYML"] = function (_0x4276ac, _0x4931aa) {
    return _0x4276ac >>> _0x4931aa;
  }, _0x338484["jWXDu"] = function (_0x34e334, _0x2205dc) {
    return _0x34e334 + _0x2205dc;
  };
  var _0x14f3aa = _0x338484,
    _0x41a74a = _0x14f3aa['BcTXF']["split"]('|'),
    _0x466fec = 0x0;
  while (!![]) {
    switch (_0x41a74a[_0x466fec++]) {
      case '0':
        return _0x507c57;
      case '1':
        _0x507c57["repeat"]["set"](2.2, 4.4);
        continue;
      case '2':
        _0xd54262['width'] = _0xec39d2;
        continue;
      case '3':
        _0x507c57['wrapS'] = THREE['RepeatWrapping'];
        continue;
      case '4':
        _0xd54262['height'] = _0xec39d2;
        continue;
      case '5':
        var _0xd54262 = document["createElement"]('canvas');
        continue;
      case '6':
        _0x507c57['anisotropy'] = 0x4;
        continue;
      case '7':
        var _0x52dff8 = _0x52f18f['createImageData'](_0xec39d2, _0xec39d2);
        continue;
      case '8':
        var _0x507c57 = new THREE['CanvasTexture'](_0xd54262);
        continue;
      case '9':
        for (var _0x54a972 = 0x0; _0x14f3aa["MXQAJ"](_0x54a972, _0xec39d2 * _0xec39d2); _0x54a972++) {
          var _0x180a93 = _0x14f3aa['RCPYa']["split"]('|'),
            _0x53a8b8 = 0x0;
          while (!![]) {
            switch (_0x180a93[_0x53a8b8++]) {
              case '0':
                _0x52dff8['data'][_0x14f3aa["fNehB"](_0x54a972, 0x4) + 0x2] = _0x4639c5;
                continue;
              case '1':
                _0x52dff8['data'][_0x54a972 * 0x4 + 0x1] = _0x4639c5;
                continue;
              case '2':
                _0x52dff8['data'][_0x14f3aa["fNehB"](_0x54a972, 0x4)] = _0x4639c5;
                continue;
              case '3':
                _0x52dff8["data"][_0x54a972 * 0x4 + 0x3] = 0xff;
                continue;
              case '4':
                var _0x417918 = _0x318017 / 0x100000000;
                continue;
              case '5':
                var _0x4639c5 = Math['round'](_0x14f3aa['WrVfS'](0xd6, _0x417918 * 0x29));
                continue;
              case '6':
                _0x318017 = _0x14f3aa['UQYML'](_0x14f3aa['jWXDu'](_0x14f3aa["fNehB"](_0x318017, 0x19660d), 0x3c6ef35f), 0x0);
                continue;
            }
            break;
          }
        }
        continue;
      case '10':
        _0x52f18f["putImageData"](_0x52dff8, 0x0, 0x0);
        continue;
      case '11':
        var _0x318017 = 0x1352841;
        continue;
      case '12':
        var _0x52f18f = _0xd54262["getContext"]('2d');
        continue;
      case '13':
        var _0xec39d2 = 0x100;
        continue;
      case '14':
        _0x507c57["wrapT"] = THREE['RepeatWrapping'];
        continue;
    }
    break;
  }
}
function buildPhoneModel(_0x5e80f5, _0x45a1e6, _0x23afd7) {
  var _0x5abff4 = {
      'qZHkF': function (_0x5987a1, _0x1807c5) {
        return _0x5987a1 - _0x1807c5;
      },
      'mlfPF': function (_0x136be1, _0x3800a5) {
        return _0x136be1 - _0x3800a5;
      },
      'XmjTJ': function (_0x5de17d, _0x5625b0) {
        return _0x5de17d * _0x5625b0;
      },
      'ATQnk': function (_0x3f7250, _0x2cc7a5) {
        return _0x3f7250 * _0x2cc7a5;
      },
      'YOtRN': function (_0x36d1b1, _0x37c082, _0x5598cd) {
        return _0x36d1b1(_0x37c082, _0x5598cd);
      },
      'LsxSe': "5|1|3|2|0|6|4",
      'uADLV': "4|1|3|2|0",
      'bwckY': function (_0x19c36f, _0x486526) {
        return _0x19c36f / _0x486526;
      },
      'VcbZw': function (_0x188791, _0x37d838) {
        return _0x188791 * _0x37d838;
      },
      'Gfvmt': function (_0x56f54d, _0x5dd6dc) {
        return _0x56f54d + _0x5dd6dc;
      },
      'YivFJ': function (_0x39de15, _0x4e347f) {
        return _0x39de15(_0x4e347f);
      },
      'tEqGM': function (_0x3a4c1c, _0x2ccd9f) {
        return _0x3a4c1c - _0x2ccd9f;
      },
      'wKDqI': function (_0x13dfb3, _0x24b812) {
        return _0x13dfb3 - _0x24b812;
      },
      'BDsxE': function (_0x511936, _0x52298c) {
        return _0x511936 - _0x52298c;
      },
      'pbmQx': function (_0x2be71a, _0x21fd71, _0x56c6a0, _0x452cc7) {
        return _0x2be71a(_0x21fd71, _0x56c6a0, _0x452cc7);
      },
      'DTthE': function (_0x1beff5, _0x2ed532) {
        return _0x1beff5(_0x2ed532);
      },
      'vmdwn': function (_0x5589b8, _0x4ad181) {
        return _0x5589b8 + _0x4ad181;
      },
      'OXHAK': function (_0x3f1164, _0x576770) {
        return _0x3f1164 - _0x576770;
      },
      'vAuhu': function (_0x102a5f, _0x1be002) {
        return _0x102a5f < _0x1be002;
      },
      'dfgMM': function (_0x37eae7, _0x3b7512) {
        return _0x37eae7 + _0x3b7512;
      },
      'blbLq': "canvas",
      'QaFMx': function (_0x2bd45d, _0x52ffb8) {
        return _0x2bd45d * _0x52ffb8;
      },
      'KLOet': function (_0x55f151, _0x5127ec) {
        return _0x55f151(_0x5127ec);
      },
      'WHOWN': function (_0x4d262b, _0x501423, _0x434115, _0x5f5bb8) {
        return _0x4d262b(_0x501423, _0x434115, _0x5f5bb8);
      },
      'Nlisp': function (_0x27e01f, _0x246543) {
        return _0x27e01f + _0x246543;
      },
      'xQjNx': function (_0x17a5de, _0x4abe8d) {
        return _0x17a5de + _0x4abe8d;
      },
      'gObCZ': function (_0x396c9f, _0x200b03) {
        return _0x396c9f + _0x200b03;
      },
      'xVazj': function (_0x5e94b0, _0x87a2dc, _0x6758fb, _0x3fe875, _0x3b5ae6, _0x39c2e8, _0xdf0ab8) {
        return _0x5e94b0(_0x87a2dc, _0x6758fb, _0x3fe875, _0x3b5ae6, _0x39c2e8, _0xdf0ab8);
      },
      'WqWTP': function (_0x18d041, _0x5096b4) {
        return _0x18d041 / _0x5096b4;
      },
      'csSAS': function (_0x2d915e, _0xe75ef8, _0x15536d, _0x59e146, _0x4e0ce0, _0x35ebd2, _0x18a40d) {
        return _0x2d915e(_0xe75ef8, _0x15536d, _0x59e146, _0x4e0ce0, _0x35ebd2, _0x18a40d);
      },
      'LWwvZ': function (_0x927523, _0x38e519) {
        return _0x927523 / _0x38e519;
      },
      'OUAac': function (_0x7ad1e0, _0x27a7e3) {
        return _0x7ad1e0 / _0x27a7e3;
      },
      'UArRU': function (_0x5a63e1, _0x1d8ab8) {
        return _0x5a63e1 / _0x1d8ab8;
      },
      'tXhxj': function (_0x23ee54, _0x3c5402) {
        return _0x23ee54 / _0x3c5402;
      },
      'LtrTi': function (_0x426e50, _0x38bf95) {
        return _0x426e50 / _0x38bf95;
      },
      'eunqm': function (_0x3c99a8, _0x1f150a) {
        return _0x3c99a8 * _0x1f150a;
      },
      'yfspr': function (_0x2cc169, _0x4f14f1) {
        return _0x2cc169(_0x4f14f1);
      },
      'CQGkt': function (_0xef98df, _0x2cedc6, _0x4875df) {
        return _0xef98df(_0x2cedc6, _0x4875df);
      },
      'mwxDa': function (_0x4e8c4c, _0xc1b6bc) {
        return _0x4e8c4c(_0xc1b6bc);
      }
    },
    _0x1ee740 = 0.9473,
    _0x317057 = 0x2,
    _0xe9975e = 0.108,
    _0x5e76d7 = 0.165,
    _0x4e817c = 0.012,
    _0x1d7be2 = 0.014,
    _0xace06b = _0x5e80f5 ? 0x28 : 0x14,
    _0x53f3ff = new THREE['Group'](),
    _0x16a4b3 = [],
    _0x3a74d6 = [],
    _0x101ffa = [];
  function _0x468834(_0xe79420) {
    return _0x16a4b3['push'](_0xe79420), _0xe79420;
  }
  function _0x3710fb(_0x4dd313) {
    return _0x3a74d6["push"](_0x4dd313), _0x4dd313;
  }
  var _0x3fe80d = {};
  _0x3fe80d["color"] = _0x45a1e6["frame"], _0x3fe80d['metalness'] = 0x1, _0x3fe80d["roughness"] = 0.34, _0x3fe80d['envMapIntensity'] = 1.15, _0x3fe80d["clearcoat"] = 0.15, _0x3fe80d['clearcoatRoughness'] = 0.3;
  var _0xb01e85 = _0x5abff4["YivFJ"](_0x3710fb, new THREE["MeshPhysicalMaterial"](_0x3fe80d)),
    _0x1cf658 = makeGrainTexture();
  _0x101ffa["push"](_0x1cf658);
  var _0x1b9c0c = {};
  _0x1b9c0c['color'] = _0x45a1e6['back'], _0x1b9c0c['metalness'] = 0x0, _0x1b9c0c["roughness"] = 0.42, _0x1b9c0c['envMapIntensity'] = 1.6, _0x1b9c0c["specularIntensity"] = 0x1, _0x1b9c0c["ior"] = 1.5, _0x1b9c0c["clearcoat"] = 0.25, _0x1b9c0c['clearcoatRoughness'] = 0.55, _0x1b9c0c['roughnessMap'] = _0x1cf658, _0x1b9c0c["bumpMap"] = _0x1cf658, _0x1b9c0c["bumpScale"] = 0.15;
  var _0x4ff7a5 = _0x5abff4["YivFJ"](_0x3710fb, new THREE['MeshPhysicalMaterial'](_0x1b9c0c)),
    _0x2b4d8a = {};
  _0x2b4d8a['color'] = 0x3070a, _0x2b4d8a['metalness'] = 0x0, _0x2b4d8a["roughness"] = 0.14, _0x2b4d8a["envMapIntensity"] = 0.9, _0x2b4d8a["clearcoat"] = 0x1, _0x2b4d8a["clearcoatRoughness"] = 0.05;
  var _0x149f1f = _0x3710fb(new THREE["MeshPhysicalMaterial"](_0x2b4d8a)),
    _0x5c063e = _0x3710fb(new THREE["MeshPhysicalMaterial"]({
      'color': _0x45a1e6['frame']['clone']()["lerp"](new THREE['Color'](0xffffff), 0.12),
      'metalness': 0x1,
      'roughness': 0.26,
      'envMapIntensity': 1.3,
      'clearcoat': 0.4,
      'clearcoatRoughness': 0.12
    })),
    _0x5445a7 = _0x3710fb(new THREE['MeshPhysicalMaterial']({
      'color': _0x45a1e6['back']['clone']()['multiplyScalar'](0.85),
      'metalness': 0x0,
      'roughness': 0.18,
      'envMapIntensity': 0.9,
      'specularIntensity': 0.6,
      'clearcoat': 0.25,
      'clearcoatRoughness': 0.1
    })),
    _0x49d8b3 = makeLensTexture();
  _0x101ffa['push'](_0x49d8b3);
  var _0x3a459d = {};
  _0x3a459d["color"] = 0xffffff, _0x3a459d['map'] = _0x49d8b3, _0x3a459d["metalness"] = 0x0, _0x3a459d["roughness"] = 0.04, _0x3a459d['ior'] = 1.5, _0x3a459d["specularIntensity"] = 0.6, _0x3a459d['envMapIntensity'] = 0.6, _0x3a459d['clearcoat'] = 0.3, _0x3a459d['clearcoatRoughness'] = 0.03, _0x3a459d['iridescence'] = 0.1, _0x3a459d['iridescenceIOR'] = 1.4, _0x3a459d["iridescenceThicknessRange"] = [0x8c, 0x12c];
  var _0x55dcfe = _0x5abff4['YivFJ'](_0x3710fb, new THREE['MeshPhysicalMaterial'](_0x3a459d)),
    _0x4b9882 = {};
  _0x4b9882['color'] = 0x7090a, _0x4b9882["metalness"] = 0x0, _0x4b9882['roughness'] = 0.1, _0x4b9882["envMapIntensity"] = 0.9, _0x4b9882["clearcoat"] = 0x1, _0x4b9882['clearcoatRoughness'] = 0.03;
  var _0x4ac902 = _0x3710fb(new THREE["MeshPhysicalMaterial"](_0x4b9882)),
    _0x19afda = {};
  _0x19afda['color'] = 0x7e7a70, _0x19afda['emissive'] = 0x0, _0x19afda["metalness"] = 0x0, _0x19afda['roughness'] = 0.7, _0x19afda["envMapIntensity"] = 0.6, _0x19afda['clearcoat'] = 0.6, _0x19afda['clearcoatRoughness'] = 0.15;
  var _0x47c5b6 = _0x3710fb(new THREE["MeshPhysicalMaterial"](_0x19afda)),
    _0x3f1a1a = {};
  _0x3f1a1a['color'] = 0x10203;
  var _0x1eb5c9 = _0x3710fb(new THREE["MeshBasicMaterial"](_0x3f1a1a)),
    _0x1f197d = _0x468834(new THREE['ExtrudeGeometry'](roundedRectShape(_0x5abff4['tEqGM'](_0x1ee740, 0x2 * _0x4e817c), _0x5abff4["wKDqI"](_0x317057, 0x2 * _0x4e817c), _0x5abff4['BDsxE'](_0x5e76d7, _0x4e817c)), {
      'depth': _0xe9975e - 0x2 * _0x1d7be2,
      'bevelEnabled': !![],
      'bevelThickness': _0x1d7be2,
      'bevelSize': _0x4e817c,
      'bevelSegments': 0xa,
      'curveSegments': _0xace06b,
      'steps': 0x1
    }));
  _0x1f197d['translate'](0x0, 0x0, _0x5abff4['bwckY'](-(_0xe9975e - _0x5abff4["ATQnk"](0x2, _0x1d7be2)), 0x2)), _0x53f3ff["add"](new THREE["Mesh"](_0x1f197d, _0xb01e85));
  var _0x434fe0 = 0.014,
    _0x25575c = 0.011,
    _0x16a43b = _0x434fe0 + _0x25575c,
    _0x134bd2 = _0x5abff4["pbmQx"](roundedRectShape, _0x1ee740 - 0x2 * _0x434fe0, _0x317057 - _0x5abff4["ATQnk"](0x2, _0x434fe0), _0x5e76d7 - _0x434fe0),
    _0x31be3f = _0xe9975e / 0x2,
    _0x15742f = _0x5abff4["DTthE"](_0x468834, new THREE['ShapeGeometry'](_0x134bd2, _0xace06b)),
    _0x1078d1 = new THREE["Mesh"](_0x15742f, _0x149f1f);
  _0x1078d1["position"]['z'] = _0x5abff4["vmdwn"](_0x31be3f, 0.0006), _0x53f3ff['add'](_0x1078d1);
  var _0x2fab19 = _0x5abff4["OXHAK"](_0x1ee740, 0x2 * _0x16a43b),
    _0x3ad5ed = _0x317057 - _0x5abff4['XmjTJ'](0x2, _0x16a43b),
    _0x13a421 = _0x5e76d7 - _0x16a43b,
    _0x3ae880 = _0x468834(new THREE["ShapeGeometry"](roundedRectShape(_0x2fab19, _0x3ad5ed, _0x13a421), _0x5e80f5 ? 0x40 : 0x24)),
    _0x15d7b4 = _0x3ae880["attributes"]['uv'],
    _0x366260 = _0x3ae880["attributes"]['position'];
  for (var _0x2aabf7 = 0x0; _0x5abff4["vAuhu"](_0x2aabf7, _0x15d7b4["count"]); _0x2aabf7++) _0x15d7b4['setXY'](_0x2aabf7, _0x366260["getX"](_0x2aabf7) / _0x2fab19 + 0.5, _0x5abff4['dfgMM'](_0x366260["getY"](_0x2aabf7) / _0x3ad5ed, 0.5));
  _0x15d7b4['needsUpdate'] = !![];
  var _0x18fa99 = 0.075,
    _0x52e22b = 0.2,
    _0x341d57 = 0.062,
    _0x2a2869 = document['createElement'](_0x5abff4['blbLq']);
  _0x2a2869['width'] = 0x800, _0x2a2869["height"] = Math['round'](_0x5abff4['bwckY'](0x800 * _0x5abff4["QaFMx"](_0x18fa99, _0x3ad5ed), _0x2fab19));
  var _0x461b3d = new THREE["CanvasTexture"](_0x2a2869);
  if (THREE["NoColorSpace"] !== undefined) _0x461b3d['colorSpace'] = THREE['NoColorSpace'];
  _0x461b3d['anisotropy'] = 0x8, _0x101ffa['push'](_0x461b3d);
  function _0x1c8cf5(_0x20f177) {
    var _0x25269f = {};
    _0x25269f['sw'] = _0x2fab19, _0x25269f["radius"] = _0x13a421, _0x25269f["islandW"] = _0x52e22b, _0x25269f["rowY"] = _0x341d57, _0x25269f["time"] = _0x20f177, drawStatusBar(_0x2a2869, _0x25269f), _0x461b3d['needsUpdate'] = !![];
  }
  _0x5abff4["KLOet"](_0x1c8cf5, _0x23afd7);
  var _0x5e3992 = {};
  _0x5e3992["value"] = null;
  var _0x3be72a = {};
  _0x3be72a["value"] = null;
  var _0x5caa8f = {};
  _0x5caa8f['value'] = _0x13a421;
  var _0x3a360c = {};
  _0x3a360c['value'] = 0x0;
  var _0x2b665d = {};
  _0x2b665d['value'] = 0x0;
  var _0x45ce2f = {};
  _0x45ce2f['value'] = 0x0;
  var _0x170a7c = {};
  _0x170a7c["value"] = 0.28;
  var _0x28e084 = {};
  _0x28e084["value"] = _0x461b3d;
  var _0x3a7072 = {};
  _0x3a7072['value'] = _0x18fa99;
  var _0x419743 = _0x3710fb(new THREE["ShaderMaterial"]({
      'vertexShader': SCREEN_VERTEX,
      'fragmentShader': SCREEN_FRAGMENT,
      'uniforms': {
        'uTexA': _0x5e3992,
        'uTexB': _0x3be72a,
        'uSizeA': {
          'value': new THREE['Vector2'](0x1, 0x1)
        },
        'uSizeB': {
          'value': new THREE["Vector2"](0x1, 0x1)
        },
        'uPlane': {
          'value': new THREE['Vector2'](_0x2fab19, _0x3ad5ed)
        },
        'uRadius': _0x5caa8f,
        'uHasA': _0x3a360c,
        'uHasB': _0x2b665d,
        'uMix': _0x45ce2f,
        'uPlate': {
          'value': new THREE['Vector3'](_0x45a1e6['plate']['r'], _0x45a1e6["plate"]['g'], _0x45a1e6["plate"]['b'])
        },
        'uSoft': _0x170a7c,
        'uBar': _0x28e084,
        'uBarFrac': _0x3a7072,
        'uInkA': {
          'value': new THREE['Vector3'](0.067, 0.07, 0.075)
        },
        'uInkB': {
          'value': new THREE["Vector3"](0.067, 0.07, 0.075)
        }
      },
      'polygonOffset': !![],
      'polygonOffsetFactor': -0x1,
      'polygonOffsetUnits': -0x1
    })),
    _0x33258f = new THREE["Mesh"](_0x3ae880, _0x419743);
  _0x33258f["position"]['z'] = _0x31be3f + 0.0012, _0x53f3ff['add'](_0x33258f);
  var _0x5f282f = _0x5abff4['wKDqI'](_0x317057 / 0x2 - _0x16a43b, _0x341d57),
    _0x5b7b81 = _0x468834(new THREE["ShapeGeometry"](_0x5abff4['WHOWN'](roundedRectShape, _0x52e22b, 0.056, 0.028), 0x18)),
    _0x2c9fa1 = {};
  _0x2c9fa1['color'] = 0x10203, _0x2c9fa1['polygonOffset'] = !![], _0x2c9fa1["polygonOffsetFactor"] = -0x4, _0x2c9fa1['polygonOffsetUnits'] = -0x4;
  var _0x38b59b = _0x3710fb(new THREE["MeshBasicMaterial"](_0x2c9fa1)),
    _0x3c1662 = new THREE['Mesh'](_0x5b7b81, _0x38b59b);
  _0x3c1662['position']["set"](0x0, _0x5f282f, _0x5abff4['Nlisp'](_0x31be3f, 0.0018)), _0x53f3ff["add"](_0x3c1662);
  var _0x3fe28d = _0x468834(new THREE['CircleGeometry'](0.0115, 0x28)),
    _0x20ec86 = _0x3710fb(_0x4ac902["clone"]());
  _0x20ec86["polygonOffset"] = !![], _0x20ec86['polygonOffsetFactor'] = -0x6, _0x20ec86["polygonOffsetUnits"] = -0x6;
  var _0x5a1295 = new THREE['Mesh'](_0x3fe28d, _0x20ec86);
  _0x5a1295['position']['set'](0.058, _0x5f282f, _0x31be3f + 0.0024), _0x53f3ff['add'](_0x5a1295);
  var _0xa62e7 = _0x3710fb(new THREE['MeshPhysicalMaterial']({
      'color': 0x0,
      'metalness': 0x0,
      'roughness': 0.07,
      'envMapIntensity': 0x1,
      'specularIntensity': 0.7,
      'opacity': 0.32,
      'transparent': !![],
      'blending': THREE['AdditiveBlending'],
      'depthWrite': ![]
    })),
    _0x214f54 = new THREE["Mesh"](_0x15742f, _0xa62e7);
  _0x214f54['position']['z'] = _0x5abff4['xQjNx'](_0x31be3f, 0.0026), _0x214f54["renderOrder"] = 0x3, _0x53f3ff["add"](_0x214f54);
  var _0x113643 = new THREE["Mesh"](_0x15742f, _0x4ff7a5);
  _0x113643["rotation"]['y'] = Math['PI'], _0x113643["position"]['z'] = _0x5abff4['wKDqI'](-_0x31be3f, 0.0006), _0x53f3ff["add"](_0x113643);
  var _0x256261 = new THREE['Group']();
  _0x256261['position']['set'](_0x5abff4["BDsxE"](_0x1ee740 / 0x2, 0.045) - 0.23, _0x5abff4["qZHkF"](_0x317057 / 0x2 - 0.045, 0.23), -_0x31be3f), _0x53f3ff['add'](_0x256261);
  var _0x51b8f2 = 0.02,
    _0x517bff = 0.005,
    _0x39369e = _0x51b8f2 + _0x517bff,
    _0x1993fe = _0x5abff4['DTthE'](_0x468834, new THREE['ExtrudeGeometry'](roundedRectShape(0.46, 0.46, 0.115), {
      'depth': _0x51b8f2,
      'bevelEnabled': !![],
      'bevelThickness': _0x517bff,
      'bevelSize': 0.006,
      'bevelSegments': 0x8,
      'curveSegments': _0x5abff4["gObCZ"](_0xace06b, 0x10),
      'steps': 0x1
    })),
    _0x3e4fe8 = new THREE['Mesh'](_0x1993fe, _0x5445a7);
  _0x3e4fe8['rotation']['y'] = Math['PI'], _0x256261['add'](_0x3e4fe8);
  var _0x1ba509 = new THREE['Group']();
  _0x1ba509["position"]['z'] = -_0x39369e, _0x1ba509['rotation']['y'] = Math['PI'], _0x256261['add'](_0x1ba509);
  var _0x456207 = _0x5e80f5 ? 0x60 : 0x40,
    _0x4d672a = 0.97;
  function _0x2271ae(_0x862107) {
    var _0x4aaa00 = {};
    _0x4aaa00["CTkFj"] = function (_0x54bfe2, _0x3d05dd) {
      return _0x54bfe2 * _0x3d05dd;
    };
    var _0x33349f = _0x4aaa00;
    return _0x862107["map"](function (_0x125d8a) {
      return [_0x33349f["CTkFj"](_0x125d8a[0x0], _0x4d672a), _0x125d8a[0x1]];
    });
  }
  var _0x5ace8a = [[0.0885, -0.003]]['concat'](_0x5abff4["xVazj"](arcPoints, 0.0865, 0.0035, 0.002, 0x0, _0x5abff4["WqWTP"](Math['PI'], 0x2), 0x5))['concat']([[0.0834, 0.0055], [0.0826, 0.0063]])['concat'](_0x5abff4['csSAS'](arcPoints, 0.0796, 0.0125, 0.003, 0x0, _0x5abff4["LWwvZ"](Math['PI'], 0x2), 0x8))['concat'](arcPoints(0.07, 0.0125, 0.003, _0x5abff4['OUAac'](Math['PI'], 0x2), Math['PI'], 0x8))['concat']([[0.067, 0.0045]]),
    _0x1d978b = _0x468834(_0x5abff4["YOtRN"](latheZ, _0x2271ae(_0x5ace8a), _0x456207)),
    _0x28ed34 = 0.0672 * _0x4d672a,
    _0x401c00 = 0.005,
    _0x16084d = _0x5abff4['Gfvmt'](_0x28ed34 * _0x28ed34, _0x401c00 * _0x401c00) / _0x5abff4["ATQnk"](0x2, _0x401c00),
    _0x39b11c = Math['asin'](_0x5abff4['WqWTP'](_0x28ed34, _0x16084d)),
    _0x318468 = 0.006;
  function _0x5b8778(_0x550116) {
    return _0x5abff4["qZHkF"](_0x318468 + Math['sqrt'](_0x5abff4['mlfPF'](_0x5abff4["XmjTJ"](_0x16084d, _0x16084d), _0x5abff4["ATQnk"](_0x550116, _0x550116))), _0x16084d * Math['cos'](_0x39b11c));
  }
  var _0x20dca9 = _0x468834(new THREE["SphereGeometry"](_0x16084d, _0x456207, 0x14, 0x0, Math['PI'] * 0x2, 0x0, _0x39b11c));
  _0x20dca9['rotateX'](_0x5abff4['UArRU'](Math['PI'], 0x2)), _0x20dca9['translate'](0x0, 0x0, _0x318468 - _0x16084d * Math["cos"](_0x39b11c));
  var _0x163408 = _0x20dca9['attributes']['uv'],
    _0x496ec3 = _0x20dca9["attributes"]["position"];
  for (var _0x9f0de0 = 0x0; _0x5abff4['vAuhu'](_0x9f0de0, _0x163408["count"]); _0x9f0de0++) _0x163408['setXY'](_0x9f0de0, _0x5abff4['vmdwn'](_0x5abff4["tXhxj"](_0x496ec3['getX'](_0x9f0de0), 0x2 * _0x28ed34), 0.5), _0x5abff4["gObCZ"](_0x5abff4['LtrTi'](_0x496ec3['getY'](_0x9f0de0), _0x5abff4["eunqm"](0x2, _0x28ed34)), 0.5));
  _0x163408['needsUpdate'] = !![];
  function _0x4bfc23(_0x2c9a8b, _0x1960e6) {
    var _0x4d52e4 = new THREE["Group"]();
    _0x4d52e4["position"]['set'](_0x2c9a8b, _0x1960e6, 0x0), _0x4d52e4["add"](new THREE["Mesh"](_0x1d978b, _0x5c063e)), _0x4d52e4["add"](new THREE["Mesh"](_0x20dca9, _0x55dcfe)), _0x1ba509["add"](_0x4d52e4);
  }
  [[0.088, 0.088], [0.088, -0.088], [-0.082, 0x0]]['forEach'](function (_0x3fbd7e) {
    _0x5abff4['YOtRN'](_0x4bfc23, -_0x3fbd7e[0x0], _0x3fbd7e[0x1]);
  });
  var _0x157d76 = [[0.0285, -0.002]]['concat'](arcPoints(0.0272, 0.0025, 0.0013, 0x0, Math['PI'] / 0x2, 0x4))['concat'](arcPoints(0.0248, 0.0025, 0.0013, Math['PI'] / 0x2, Math['PI'], 0x4))['concat']([[0.0233, 0.0008]]),
    _0x1c4ad7 = _0x468834(latheZ(_0x157d76, _0x456207)),
    _0x14a98f = _0x5abff4['yfspr'](_0x468834, new THREE['CircleGeometry'](0.0235, _0x456207));
  function _0x5212b6(_0x3939f0, _0x477fcc, _0x5b08c8) {
    var _0x587fd8 = _0x5abff4["LsxSe"]["split"]('|'),
      _0x321201 = 0x0;
    while (!![]) {
      switch (_0x587fd8[_0x321201++]) {
        case '0':
          _0x5c73e1['position']['z'] = 0.0012;
          continue;
        case '1':
          _0x410273["position"]['set'](_0x3939f0, _0x477fcc, 0x0);
          continue;
        case '2':
          var _0x5c73e1 = new THREE['Mesh'](_0x14a98f, _0x5b08c8);
          continue;
        case '3':
          _0x410273['add'](new THREE['Mesh'](_0x1c4ad7, _0x5c063e));
          continue;
        case '4':
          _0x1ba509['add'](_0x410273);
          continue;
        case '5':
          var _0x410273 = new THREE['Group']();
          continue;
        case '6':
          _0x410273['add'](_0x5c73e1);
          continue;
      }
      break;
    }
  }
  _0x5212b6(0.082, 0.155, _0x47c5b6), _0x5abff4['pbmQx'](_0x5212b6, 0.082, -0.155, _0x4ac902);
  var _0x385360 = [[0.0085, -0.001], [0.0085, 0.0009], [0.0079, 0.0015], [0.0064, 0.0015], [0.0058, 0.001], [0.0058, -0.0002]],
    _0x54c7b5 = _0x468834(_0x5abff4["CQGkt"](latheZ, _0x385360, 0x20)),
    _0x5bef1b = _0x5abff4['mwxDa'](_0x468834, new THREE["CircleGeometry"](0.0061, 0x18)),
    _0x47feb3 = new THREE['Group']();
  _0x47feb3["position"]['set'](0.18, 0.172, 0x0), _0x47feb3['add'](new THREE['Mesh'](_0x54c7b5, _0x5c063e));
  var _0x723f2f = new THREE["Mesh"](_0x5bef1b, _0x1eb5c9);
  _0x723f2f["position"]['z'] = 0.0004, _0x47feb3["add"](_0x723f2f), _0x1ba509['add'](_0x47feb3);
  function _0xef05ba(_0x5d4aa4, _0xbb693a, _0x57cab0) {
    var _0x45f804 = _0x5abff4["uADLV"]["split"]('|'),
      _0x437093 = 0x0;
    while (!![]) {
      switch (_0x45f804[_0x437093++]) {
        case '0':
          _0x53f3ff["add"](_0x4c2c63);
          continue;
        case '1':
          _0x246e7e['rotateY'](_0x5d4aa4 > 0x0 ? _0x5abff4['bwckY'](Math['PI'], 0x2) : -Math['PI'] / 0x2);
          continue;
        case '2':
          _0x4c2c63["position"]['set'](_0x5abff4["VcbZw"](_0x5d4aa4, _0x1ee740 / 0x2 - 0.004), _0xbb693a, 0x0);
          continue;
        case '3':
          var _0x4c2c63 = new THREE['Mesh'](_0x246e7e, _0xb01e85);
          continue;
        case '4':
          var _0x4b4dc7 = {};
          _0x4b4dc7['depth'] = 0.012, _0x4b4dc7["bevelEnabled"] = !![], _0x4b4dc7['bevelThickness'] = 0.003, _0x4b4dc7['bevelSize'] = 0.003, _0x4b4dc7['bevelSegments'] = 0x2, _0x4b4dc7["curveSegments"] = 0x8;
          var _0x246e7e = _0x468834(new THREE['ExtrudeGeometry'](roundedRectShape(0.045, _0x57cab0, 0.012), _0x4b4dc7));
          continue;
      }
      break;
    }
  }
  _0xef05ba(0x1, 0.36, 0.2), _0x5abff4["pbmQx"](_0xef05ba, -0x1, 0.62, 0.075), _0xef05ba(-0x1, 0.42, 0.13), _0x5abff4['WHOWN'](_0xef05ba, -0x1, 0.24, 0.13);
  var _0x377bec = _0x5abff4['DTthE'](_0x468834, new THREE['ShapeGeometry'](_0x5abff4['WHOWN'](roundedRectShape, 0.11, 0.03, 0.015), 0xa)),
    _0x104ed3 = new THREE["Mesh"](_0x377bec, _0x1eb5c9);
  _0x104ed3['rotation']['x'] = _0x5abff4['WqWTP'](Math['PI'], 0x2), _0x104ed3["position"]['set'](0x0, _0x5abff4['BDsxE'](-_0x317057 / 0x2, 0.0006), 0x0), _0x53f3ff['add'](_0x104ed3);
  var _0x545bf3 = _0x468834(new THREE['CircleGeometry'](0.0055, 0xa)),
    _0x4ba226 = new THREE['InstancedMesh'](_0x545bf3, _0x1eb5c9, 0x10),
    _0x2c1a0a = new THREE["Object3D"]();
  for (var _0x437ef1 = 0x0; _0x437ef1 < 0x8; _0x437ef1++) {
    [-0x1, 0x1]["forEach"](function (_0x40c36d, _0x52c610) {
      _0x2c1a0a["position"]['set'](_0x5abff4["VcbZw"](_0x40c36d, _0x5abff4["Gfvmt"](0.17, _0x437ef1 * 0.03)), _0x5abff4['mlfPF'](-_0x317057 / 0x2, 0.0006), 0x0), _0x2c1a0a["rotation"]['set'](Math['PI'] / 0x2, 0x0, 0x0), _0x2c1a0a["updateMatrix"](), _0x4ba226['setMatrixAt'](_0x437ef1 * 0x2 + _0x52c610, _0x2c1a0a["matrix"]);
    });
  }
  return _0x4ba226["instanceMatrix"]['needsUpdate'] = !![], _0x53f3ff['add'](_0x4ba226), {
    'group': _0x53f3ff,
    'screenMat': _0x419743,
    'paintStatusBar': _0x1c8cf5,
    'dispose': function () {
      _0x16a4b3['forEach'](function (_0x29224d) {
        _0x29224d['dispose']();
      }), _0x3a74d6['forEach'](function (_0x5d9040) {
        _0x5d9040["dispose"]();
      }), _0x101ffa['forEach'](function (_0x3cfebc) {
        _0x3cfebc['dispose']();
      }), _0x4ba226['dispose']();
    }
  };
}
function buildPhone(_0x53dd1e) {
  var _0x1f0a9a = {
      'fmKQz': function (_0x4e3324, _0x11dd2f) {
        return _0x4e3324 || _0x11dd2f;
      },
      'gHzOX': "9|4|6|10|5|3|8|0|2|1|7",
      'TWpmQ': function (_0x55a61e, _0xb45e76) {
        return _0x55a61e !== _0xb45e76;
      },
      'manhX': function (_0x166607, _0x57021c, _0x3146a3) {
        return _0x166607(_0x57021c, _0x3146a3);
      },
      'NnuMG': function (_0x539c13, _0x2ff039) {
        return _0x539c13 + _0x2ff039;
      },
      'dhmoX': function (_0x2664a4, _0x2a1518) {
        return _0x2664a4 / _0x2a1518;
      },
      'ylgZY': function (_0x21c57d, _0x2731cd) {
        return _0x21c57d + _0x2731cd;
      },
      'ykrrP': function (_0x4f4efb, _0x4f6ab1) {
        return _0x4f4efb && _0x4f6ab1;
      },
      'HwMUg': function (_0x1c38de, _0x4b6120) {
        return _0x1c38de * _0x4b6120;
      },
      'LxzRw': function (_0x118c79) {
        return _0x118c79();
      },
      'HnwFK': function (_0x18912e, _0x20a512) {
        return _0x18912e * _0x20a512;
      },
      'bgHRr': function (_0x17972f, _0x2b6f5f) {
        return _0x17972f * _0x2b6f5f;
      },
      'UArKU': function (_0x23ade5, _0x2260a9) {
        return _0x23ade5 * _0x2260a9;
      },
      'DghrR': function (_0x487bab, _0x2a1103, _0x1c1eda, _0x529c30) {
        return _0x487bab(_0x2a1103, _0x1c1eda, _0x529c30);
      },
      'cfdZW': function (_0x4e5be8, _0x386f93) {
        return _0x4e5be8 - _0x386f93;
      },
      'sIYfD': "dark",
      'ZYIhI': function (_0x39ded4, _0x12e60f, _0x24851e, _0x4dc895) {
        return _0x39ded4(_0x12e60f, _0x24851e, _0x4dc895);
      },
      'TEhfo': function (_0x29f570, _0x9dd871) {
        return _0x29f570 / _0x9dd871;
      },
      'OBWsh': function (_0x344c17, _0x27bbdf) {
        return _0x344c17 !== _0x27bbdf;
      },
      'GbAhd': function (_0x251c67, _0x5dc378) {
        return _0x251c67(_0x5dc378);
      },
      'QeWTl': function (_0x42d6b8, _0x544e67) {
        return _0x42d6b8 - _0x544e67;
      },
      'WgPZs': "pt-is-shown",
      'pkVqO': function (_0x152e13, _0x25da92) {
        return _0x152e13 > _0x25da92;
      },
      'GghVA': function (_0x23d9a3, _0xd92c88) {
        return _0x23d9a3 * _0xd92c88;
      },
      'VxUCd': function (_0x7a1962, _0x2e92ec) {
        return _0x7a1962 + _0x2e92ec;
      },
      'ddptn': function (_0x4480d3, _0x70809e) {
        return _0x4480d3 + _0x70809e;
      },
      'OKipG': function (_0x2f55b7, _0x5c6fc3) {
        return _0x2f55b7 - _0x5c6fc3;
      },
      'eLFYE': function (_0x40a1b, _0x43a996) {
        return _0x40a1b * _0x43a996;
      },
      'jqEcH': function (_0x3482b6, _0x51030d) {
        return _0x3482b6 || _0x51030d;
      },
      'zkBFl': function (_0x3f1392, _0x506a10) {
        return _0x3f1392 === _0x506a10;
      },
      'LzFgs': function (_0x5a9327, _0x4e5cbc) {
        return _0x5a9327 || _0x4e5cbc;
      },
      'XSyEu': 'data-phone',
      'KWdSa': 'ready',
      'ioBof': function (_0x5e712e, _0x39d62c) {
        return _0x5e712e - _0x39d62c;
      },
      'AfiWQ': function (_0x5eb7cc, _0x2ccb07) {
        return _0x5eb7cc < _0x2ccb07;
      },
      'eiZNd': function (_0x29a844, _0x74a060) {
        return _0x29a844 * _0x74a060;
      },
      'qafiR': function (_0x3f5b79, _0x50af72) {
        return _0x3f5b79 - _0x50af72;
      },
      'QnBFG': 'pointerleave',
      'cjswb': "webglcontextlost",
      'rFdSW': 'webglcontextrestored',
      'UHtmG': "canvas",
      'OwNsA': "aria-hidden",
      'wdmJc': 'high-performance',
      'LpnHh': function (_0x29e9f7, _0x164e98) {
        return _0x29e9f7 !== _0x164e98;
      },
      'fvfVa': '--phone-frame',
      'kaeej': "#1D3441",
      'uyvgm': function (_0x4ac089, _0x554a58, _0x5ce7c2) {
        return _0x4ac089(_0x554a58, _0x5ce7c2);
      },
      'KwQHe': "--brand",
      'JIFgt': '#FF6F91',
      'WhDQF': function (_0x450430, _0x29d3b0, _0x30aadc) {
        return _0x450430(_0x29d3b0, _0x30aadc);
      },
      'ivzhQ': "9:41",
      'dkHFe': "YXZ",
      'aUJsm': "pointermove",
      'PlmRK': "still",
      'zsDRh': function (_0xc83fa3, _0x35fb2c, _0x4caa87) {
        return _0xc83fa3(_0x35fb2c, _0x4caa87);
      }
    },
    _0x3dc8e8 = _0x53dd1e["heroSlot"],
    _0x73b6cb = _0x53dd1e['storySlot'],
    _0x572d4d = _0x53dd1e['stage'],
    _0x4bc436 = _0x53dd1e['screens'],
    _0x42cda1 = _0x53dd1e["isFine"],
    _0x1c81b9 = document['createElement'](_0x1f0a9a['UHtmG']);
  _0x1c81b9["className"] = "pt-phone-canvas", _0x1c81b9['setAttribute'](_0x1f0a9a["OwNsA"], 'true');
  var _0x5c6798;
  try {
    var _0x589e2c = {};
    _0x589e2c['canvas'] = _0x1c81b9, _0x589e2c['antialias'] = !![], _0x589e2c['alpha'] = !![], _0x589e2c["powerPreference"] = _0x1f0a9a['wdmJc'], _0x5c6798 = new THREE["WebGLRenderer"](_0x589e2c);
  } catch (_0x191921) {
    return null;
  }
  document["body"]['appendChild'](_0x1c81b9), _0x5c6798['setPixelRatio'](Math["min"](window['devicePixelRatio'] || 0x1, _0x42cda1 ? 0x2 : 1.5)), _0x5c6798['setClearColor'](0x0, 0x0), _0x5c6798["toneMapping"] = _0x1f0a9a['LpnHh'](THREE['NeutralToneMapping'], undefined) ? THREE['NeutralToneMapping'] : THREE["ACESFilmicToneMapping"], _0x5c6798["toneMappingExposure"] = 1.1;
  var _0x4b1ae6 = new THREE['Scene'](),
    _0x2a6e3e = new THREE["PerspectiveCamera"](0x1e, 0x1, 0x32, 0x1388),
    _0x505ecc = 0x44c;
  _0x2a6e3e['position']['set'](0x0, 0x0, _0x505ecc);
  var _0x436bb2 = _0x1f0a9a['GbAhd'](getComputedStyle, document['documentElement']);
  function _0x5071ec(_0x146b37, _0x4a8cd7) {
    var _0x1c7152 = _0x436bb2['getPropertyValue'](_0x146b37)['trim']();
    return _0x1f0a9a['fmKQz'](_0x1c7152, _0x4a8cd7);
  }
  var _0xa4b4b4 = {
    'frame': new THREE["Color"](_0x5071ec(_0x1f0a9a['fvfVa'], "#5A6870")),
    'back': new THREE['Color'](_0x1f0a9a["manhX"](_0x5071ec, "--phone-back", _0x1f0a9a["kaeej"])),
    'plate': new THREE["Color"](_0x1f0a9a["manhX"](_0x5071ec, '--screen-bg', "#FFF9F4"))
  };
  _0xa4b4b4['plate']['convertLinearToSRGB']();
  var _0x115a2d = new THREE['Color'](_0x1f0a9a['uyvgm'](_0x5071ec, _0x1f0a9a["KwQHe"], _0x1f0a9a["JIFgt"]))['lerp'](new THREE["Color"](0xffffff), 0.6),
    _0x350b89 = _0x1f0a9a['WhDQF'](buildEnvironment, _0x5c6798, _0x115a2d);
  _0x4b1ae6["environment"] = _0x350b89['texture'];
  var _0xa61bf = new THREE['DirectionalLight'](0xffffff, 0.9);
  _0xa61bf['position']['set'](0x3, 0x4, 0x6), _0x4b1ae6['add'](_0xa61bf);
  var _0x328ccf = _0x3dc8e8 && _0x3dc8e8['dataset']['statusTime'] || _0x1f0a9a["ivzhQ"],
    _0x4ee353 = _0x1f0a9a['DghrR'](buildPhoneModel, _0x42cda1, _0xa4b4b4, _0x328ccf);
  _0x4b1ae6['add'](_0x4ee353["group"]), _0x4ee353["group"]["rotation"]['order'] = _0x1f0a9a['dkHFe'];
  var _0x10bb8e = _0x4bc436["map"](function () {
      return null;
    }),
    _0x1dc235 = _0x4bc436["map"](function () {
      return "light";
    }),
    _0x5104c9 = ![];
  function _0x478f11(_0x2368f5, _0x28f58a) {
    var _0x1fdad1 = _0x1f0a9a['gHzOX']['split']('|'),
      _0x4b18db = 0x0;
    while (!![]) {
      switch (_0x1fdad1[_0x4b18db++]) {
        case '0':
          _0x30d42f['wrapT'] = THREE['ClampToEdgeWrapping'];
          continue;
        case '1':
          _0x10bb8e[_0x2368f5] = _0x30d42f;
          continue;
        case '2':
          _0x30d42f['needsUpdate'] = !![];
          continue;
        case '3':
          _0x30d42f['anisotropy'] = Math["min"](0x8, _0x5c6798["capabilities"]["getMaxAnisotropy"]());
          continue;
        case '4':
          var _0x30d42f = new THREE['Texture'](_0x28f58a);
          continue;
        case '5':
          _0x30d42f["magFilter"] = THREE["LinearFilter"];
          continue;
        case '6':
          if (_0x1f0a9a["TWpmQ"](THREE["NoColorSpace"], undefined)) _0x30d42f["colorSpace"] = THREE['NoColorSpace'];
          continue;
        case '7':
          _0x1dc235[_0x2368f5] = _0x1f0a9a['manhX'](screenTone, _0x28f58a, _0x28f58a['dataset']['tone']);
          continue;
        case '8':
          _0x30d42f['wrapS'] = THREE['ClampToEdgeWrapping'];
          continue;
        case '9':
          if (_0x5104c9 || !_0x28f58a) return;
          continue;
        case '10':
          _0x30d42f['minFilter'] = THREE["LinearMipmapLinearFilter"];
          continue;
      }
      break;
    }
  }
  var _0x1998af = Promise["all"](_0x4bc436['map'](function (_0x55755c, _0x52922c) {
      return whenImageReady(_0x55755c)["then"](function (_0x22c885) {
        _0x1f0a9a["manhX"](_0x478f11, _0x52922c, _0x22c885);
      });
    })),
    _0x1bce82 = {};
  _0x1bce82["glide"] = 0x0, _0x1bce82["screen"] = 0x0, _0x1bce82['ry'] = 0x0, _0x1bce82['rx'] = 0x0, _0x1bce82['pop'] = 0x0, _0x1bce82['intro'] = 0x1;
  var _0x2a2ab0 = _0x1bce82,
    _0x104ed8 = null,
    _0x4743b4 = null,
    _0x36c72f = function () {
      return 0x0;
    },
    _0xd004a5 = 0x1,
    _0xf0177b = 0x1;
  function _0x203f3e() {
    var _0xe4e2d6 = window['scrollY'] || window["pageYOffset"] || 0x0;
    if (_0x3dc8e8) {
      var _0xf8bd20 = _0x3dc8e8['getBoundingClientRect']();
      _0x104ed8 = {
        'cx': _0x1f0a9a['NnuMG'](_0xf8bd20["left"], _0x1f0a9a['dhmoX'](_0xf8bd20["width"], 0x2)),
        'cy': _0x1f0a9a["ylgZY"](_0xf8bd20['top'] + _0xe4e2d6, _0xf8bd20['height'] / 0x2),
        'h': _0xf8bd20["height"]
      };
    }
    if (_0x1f0a9a["ykrrP"](_0x73b6cb, _0x572d4d)) {
      var _0x4f95ba = _0x73b6cb["getBoundingClientRect"](),
        _0x52040b = _0x572d4d['getBoundingClientRect']();
      if (_0x4f95ba["height"] > 0x0) _0x4743b4 = {
        'cx': _0x4f95ba["left"] + _0x4f95ba["width"] / 0x2,
        'cy': _0x4f95ba['top'] - _0x52040b['top'] + _0x4f95ba['height'] / 0x2,
        'h': _0x4f95ba["height"]
      };
    }
    if (!_0x104ed8) _0x104ed8 = _0x4743b4;
    if (!_0x4743b4) _0x4743b4 = _0x104ed8;
  }
  function _0x4fe398() {
    if (_0x5104c9) return;
    _0xd004a5 = _0x1c81b9["clientWidth"] || window["innerWidth"], _0xf0177b = _0x1c81b9["clientHeight"] || window["innerHeight"], _0x5c6798['setSize'](_0xd004a5, _0xf0177b, ![]), _0x2a6e3e["aspect"] = _0xd004a5 / _0xf0177b, _0x2a6e3e['fov'] = _0x1f0a9a['dhmoX'](_0x1f0a9a["HwMUg"](0x2 * Math['atan'](_0xf0177b / 0x2 / _0x505ecc), 0xb4), Math['PI']), _0x2a6e3e['updateProjectionMatrix'](), _0x1f0a9a['LxzRw'](_0x203f3e);
  }
  var _0x420f49 = {};
  _0x420f49['x'] = 0x0, _0x420f49['y'] = 0x0, _0x420f49['tx'] = 0x0, _0x420f49['ty'] = 0x0;
  var _0x208fcd = _0x420f49;
  function _0x180cd8(_0xe67c37) {
    _0x208fcd['tx'] = clamp(_0x1f0a9a["HwMUg"](_0xe67c37['clientX'] / window["innerWidth"], 0x2) - 0x1, -0x1, 0x1), _0x208fcd['ty'] = clamp(_0x1f0a9a['HnwFK'](_0xe67c37['clientY'] / window['innerHeight'], 0x2) - 0x1, -0x1, 0x1);
  }
  function _0x5f1201() {
    _0x208fcd['tx'] = 0x0, _0x208fcd['ty'] = 0x0;
  }
  _0x42cda1 && (window["addEventListener"](_0x1f0a9a['aUJsm'], _0x180cd8), document['documentElement']["addEventListener"](_0x1f0a9a["QnBFG"], _0x5f1201));
  var _0xe2c490 = new URLSearchParams(location["search"])["get"](_0x1f0a9a["PlmRK"]) === '1',
    _0xd6f2c4 = !_0xe2c490 && num(_0x3dc8e8 && _0x3dc8e8["dataset"]['idle'], 0x1) !== 0x0,
    _0x5d8cb1 = !_0xe2c490 && num(_0x3dc8e8 && _0x3dc8e8['dataset']['intro'], 0x1) !== 0x0,
    _0x42a179 = _0x1f0a9a['zsDRh'](num, _0x3dc8e8 && _0x3dc8e8["dataset"]["tilt"], 0x0),
    _0x1d66ea = 0x0,
    _0x3cb578 = 0x0,
    _0x26ac03 = !![],
    _0x2f3856 = ![],
    _0x19be4f = _0x4bc436['length'],
    _0x1cfa3d = {};
  _0x1cfa3d['a'] = null, _0x1cfa3d['b'] = null;
  var _0x54d658 = _0x1cfa3d;
  function _0x25cce7(_0x3ca083, _0x2fd623) {
    var _0xd7e018 = '24|19|4|7|11|35|23|31|37|12|25|6|10|2|15|29|16|5|0|1|13|36|18|32|21|34|20|8|38|30|27|26|22|3|33|39|17|9|14|28'['split']('|'),
      _0x440f51 = 0x0;
    while (!![]) {
      switch (_0xd7e018[_0x440f51++]) {
        case '0':
          var _0x8bdaca = _0x1f0a9a["bgHRr"](_0x1f0a9a['dhmoX'](_0x55c7ac, 0x2) * (0x1 + _0x1f0a9a['UArKU'](0.05, _0x2a2ab0['pop'])), _0x1f0a9a['DghrR'](lerp, 0.9, 0x1, _0x4fe956));
          continue;
        case '1':
          var _0x4b089d = _0x1f0a9a["bgHRr"](_0x1f0a9a["bgHRr"](0x1 - _0x4fe956, _0x55c7ac), 0.1);
          continue;
        case '2':
          var _0x55c7ac = lerp(_0x104ed8['h'], _0x4743b4['h'], _0x1d5652);
          continue;
        case '3':
          var _0x1fa07c = _0x1dc235[Math["min"](_0x32ee82 + 0x1, _0x1f0a9a["cfdZW"](_0x19be4f, 0x1))] === _0x1f0a9a['sIYfD'] ? 0x1 : 0.067;
          continue;
        case '4':
          _0x1d66ea += _0x202c45;
          continue;
        case '5':
          var _0x4db120 = _0xd6f2c4 ? Math["sin"](_0x1d66ea * 0.7) * 0.012 : 0x0;
          continue;
        case '6':
          var _0x2b4415 = _0x1f0a9a["ZYIhI"](lerp, _0x104ed8['cx'], _0x4743b4['cx'], _0x1d5652);
          continue;
        case '7':
          var _0x1a32f1 = _0x1f0a9a['cfdZW'](0x1, Math['pow'](0x1 - 0.07, _0x1f0a9a['TEhfo'](_0x202c45, 0x1 / 0x3c)));
          continue;
        case '8':
          var _0x233fc8 = _0x10bb8e[_0x32ee82] || null;
          continue;
        case '9':
          _0x1f0a9a["OBWsh"](_0x257ab3, _0x3cb578) && (_0x3cb578 = _0x257ab3, _0x1c81b9["style"]['opacity'] = _0x1f0a9a['GbAhd'](String, _0x3cb578));
          continue;
        case '10':
          var _0x4086ac = _0x1f0a9a["DghrR"](lerp, _0x104ed8['cy'], _0x4743b4['cy'], _0x1d5652);
          continue;
        case '11':
          _0x208fcd['x'] += _0x1f0a9a['QeWTl'](_0x208fcd['tx'], _0x208fcd['x']) * _0x1a32f1;
          continue;
        case '12':
          if (!_0xb020a4) {
            if (_0x1c81b9["classList"]["contains"](_0x1f0a9a["WgPZs"])) _0x1c81b9['classList']['remove']("pt-is-shown");
            return;
          }
          continue;
        case '13':
          _0x4ee353['group']['position']['set'](_0x1f0a9a["cfdZW"](_0x2b4415, _0x1f0a9a['TEhfo'](_0xd004a5, 0x2)), -(_0x4086ac - _0xf0177b / 0x2) - _0x39f211 - _0x4b089d, 0x0);
          continue;
        case '14':
          _0x5c6798['render'](_0x4b1ae6, _0x2a6e3e);
          continue;
        case '15':
          if (_0x3ec71e && _0x1f0a9a['pkVqO'](_0x225797, _0x3ec71e)) _0x4086ac -= _0x1f0a9a['QeWTl'](_0x225797, _0x3ec71e) * (_0x1d5652 >= 0.999 ? 0x1 : 0x0);
          continue;
        case '16':
          var _0x39f211 = _0xd6f2c4 ? Math["sin"](_0x1f0a9a["HwMUg"](_0x1d66ea, 1.15)) * _0x55c7ac * 0.0075 : 0x0;
          continue;
        case '17':
          var _0x257ab3 = clamp(_0x1f0a9a['GghVA'](_0x4fe956, 2.4), 0x0, 0x1);
          continue;
        case '18':
          _0x4ee353["group"]['rotation']["set"](_0x2a2ab0['rx'] - _0x1f0a9a["GghVA"](_0x208fcd['y'], 0.1), _0x1f0a9a['VxUCd'](_0x1f0a9a["ddptn"](_0x2a2ab0['ry'], _0x42a179 * _0x1f0a9a['OKipG'](0x1, _0x1d5652)), _0x1f0a9a['eLFYE'](_0x208fcd['x'], 0.2)) - (0x1 - _0x4fe956) * 1.15, _0x4db120);
          continue;
        case '19':
          var _0x202c45 = Math["min"](_0x1f0a9a["jqEcH"](_0x2fd623, 16.7) / 0x3e8, 0.05);
          continue;
        case '20':
          var _0xe98e63 = _0x4ee353["screenMat"]['uniforms'];
          continue;
        case '21':
          var _0x32ee82 = Math["min"](Math['floor'](_0x3ef800), Math['max'](_0x1f0a9a['QeWTl'](_0x19be4f, 0x2), 0x0));
          continue;
        case '22':
          var _0x117d0d = _0x1f0a9a["zkBFl"](_0x1dc235[_0x32ee82], _0x1f0a9a["sIYfD"]) ? 0x1 : 0.067;
          continue;
        case '23':
          var _0x225797 = window["scrollY"] || window["pageYOffset"] || 0x0;
          continue;
        case '24':
          if (_0x1f0a9a["LzFgs"](_0x5104c9, !_0x26ac03)) return;
          continue;
        case '25':
          var _0x1d5652 = _0x2a2ab0['glide'];
          continue;
        case '26':
          _0xe98e63['uMix']["value"] = smoothstep(0.3, 0.7, _0x1b9129);
          continue;
        case '27':
          if (_0x54d658['b'] !== _0x94ef9a) {
            _0x54d658['b'] = _0x94ef9a, _0xe98e63['uTexB']['value'] = _0x94ef9a, _0xe98e63['uHasB']['value'] = _0x94ef9a ? 0x1 : 0x0;
            if (_0x94ef9a) _0xe98e63["uSizeB"]["value"]['set'](_0x94ef9a['image']["naturalWidth"] || 0x1, _0x94ef9a['image']['naturalHeight'] || 0x1);
          }
          continue;
        case '28':
          if (!_0x2f3856 && _0x10bb8e[0x0]) _0x2f3856 = !![], _0x1c81b9['classList']["add"]("pt-is-shown"), document["documentElement"]["setAttribute"](_0x1f0a9a["XSyEu"], _0x1f0a9a["KWdSa"]);else _0x2f3856 && !_0x1c81b9["classList"]["contains"](_0x1f0a9a['WgPZs']) && _0x1c81b9["classList"]["add"](_0x1f0a9a["WgPZs"]);
          continue;
        case '29':
          var _0x4fe956 = _0x2a2ab0["intro"];
          continue;
        case '30':
          if (_0x54d658['a'] !== _0x233fc8) {
            _0x54d658['a'] = _0x233fc8, _0xe98e63['uTexA']['value'] = _0x233fc8, _0xe98e63['uHasA']["value"] = _0x233fc8 ? 0x1 : 0x0;
            if (_0x233fc8) _0xe98e63["uSizeA"]["value"]['set'](_0x233fc8['image']['naturalWidth'] || 0x1, _0x233fc8['image']['naturalHeight'] || 0x1);
          }
          continue;
        case '31':
          var _0x3ec71e = _0x36c72f();
          continue;
        case '32':
          var _0x3ef800 = clamp(_0x2a2ab0['screen'], 0x0, Math["max"](_0x1f0a9a['QeWTl'](_0x19be4f, 0x1), 0x0));
          continue;
        case '33':
          _0xe98e63["uInkA"]['value']['set'](_0x117d0d, _0x117d0d === 0x1 ? 0x1 : 0.07, _0x117d0d === 0x1 ? 0x1 : 0.075);
          continue;
        case '34':
          var _0x1b9129 = _0x1f0a9a["pkVqO"](_0x19be4f, 0x1) ? _0x1f0a9a["ioBof"](_0x3ef800, _0x32ee82) : 0x0;
          continue;
        case '35':
          _0x208fcd['y'] += _0x1f0a9a['UArKU'](_0x208fcd['ty'] - _0x208fcd['y'], _0x1a32f1);
          continue;
        case '36':
          _0x4ee353["group"]['scale']["setScalar"](_0x8bdaca);
          continue;
        case '37':
          var _0xb020a4 = !!_0x104ed8 && (_0x3ec71e ? _0x1f0a9a['AfiWQ'](_0x225797, _0x1f0a9a["NnuMG"](_0x3ec71e, _0x1f0a9a['bgHRr'](_0xf0177b, 1.2))) : _0x1f0a9a["AfiWQ"](_0x225797, _0x1f0a9a['eiZNd'](_0xf0177b, 1.5))) && !document['hidden'];
          continue;
        case '38':
          var _0x94ef9a = _0x10bb8e[Math["min"](_0x32ee82 + 0x1, _0x1f0a9a["qafiR"](_0x19be4f, 0x1))] || null;
          continue;
        case '39':
          _0xe98e63["uInkB"]["value"]["set"](_0x1fa07c, _0x1f0a9a["zkBFl"](_0x1fa07c, 0x1) ? 0x1 : 0.07, _0x1f0a9a['zkBFl'](_0x1fa07c, 0x1) ? 0x1 : 0.075);
          continue;
      }
      break;
    }
  }
  gsap["ticker"]["add"](_0x25cce7);
  function _0x514172(_0x96dc70) {
    _0x96dc70['preventDefault'](), _0x26ac03 = ![];
  }
  function _0x56b1d5() {
    _0x350b89["dispose"](), _0x350b89 = buildEnvironment(_0x5c6798, _0x115a2d), _0x4b1ae6["environment"] = _0x350b89['texture'], _0x26ac03 = !![];
  }
  _0x1c81b9["addEventListener"](_0x1f0a9a['cjswb'], _0x514172), _0x1c81b9["addEventListener"](_0x1f0a9a["rFdSW"], _0x56b1d5);
  var _0x77e5a7 = new ResizeObserver(_0x4fe398);
  _0x77e5a7['observe'](_0x1c81b9), _0x1f0a9a['LxzRw'](_0x4fe398);
  function _0x5214fd() {
    if (!_0x5104c9) _0x4ee353['paintStatusBar'](_0x328ccf);
  }
  return document['fonts'] && document['fonts']['load'] && (document["fonts"]["load"]("600 17px \"Inter\"")["then"](_0x5214fd, function () {}), document["fonts"]['ready']['then'](_0x5214fd)), {
    'canvas': _0x1c81b9,
    'pose': _0x2a2ab0,
    'ready': _0x1998af,
    'introOn': _0x5d8cb1,
    'measure': _0x203f3e,
    'setPinEnd': function (_0x27aa1d) {
      _0x36c72f = _0x27aa1d;
    },
    'destroy': function () {
      _0x5104c9 = !![], _0x26ac03 = ![], gsap['ticker']["remove"](_0x25cce7), _0x77e5a7['disconnect'](), window["removeEventListener"]('pointermove', _0x180cd8), document["documentElement"]["removeEventListener"](_0x1f0a9a["QnBFG"], _0x5f1201), _0x1c81b9["removeEventListener"](_0x1f0a9a["cjswb"], _0x514172), _0x1c81b9['removeEventListener'](_0x1f0a9a["rFdSW"], _0x56b1d5), _0x4b1ae6["remove"](_0x4ee353['group']), _0x4ee353['dispose'](), _0x10bb8e["forEach"](function (_0x3f4d0d) {
        if (_0x3f4d0d) _0x3f4d0d["dispose"]();
      }), _0x350b89['dispose'](), _0x5c6798["dispose"]();
      if (_0x5c6798['forceContextLoss']) _0x5c6798["forceContextLoss"]();
      if (_0x1c81b9['parentNode']) _0x1c81b9["parentNode"]['removeChild'](_0x1c81b9);
      document["documentElement"]['removeAttribute'](_0x1f0a9a["XSyEu"]);
    }
  };
}
(function onReady(_0xe6fd5f) {
  var _0x17c9a2 = {
    'yOkLc': "loading",
    'KheLV': "DOMContentLoaded",
    'BhfhS': function (_0x5b1a04) {
      return _0x5b1a04();
    }
  };
  document["readyState"] === _0x17c9a2['yOkLc'] ? document["addEventListener"](_0x17c9a2['KheLV'], _0xe6fd5f) : _0x17c9a2['BhfhS'](_0xe6fd5f);
})(function initTemplate() {
  var _0x449e7b = {
    'MAavm': '2|1|4|5|0|3',
    'IKDGL': function (_0x3714d7, _0x300e93) {
      return _0x3714d7 === _0x300e93;
    },
    'lfSMb': "refresh",
    'IBYOQ': function (_0x4d6949, _0x1a8f01) {
      return _0x4d6949 !== _0x1a8f01;
    },
    'EZKIw': 'smooth',
    'fbbTE': "off",
    'pELhW': function (_0x10ebc5, _0x56a08d) {
      return _0x10ebc5 === _0x56a08d;
    },
    'mormG': 'undefined',
    'wFHcH': function (_0x26196a, _0x44a364) {
      return _0x26196a !== _0x44a364;
    },
    'OWxqz': function (_0x484a57, _0x18ef33) {
      return _0x484a57 === _0x18ef33;
    },
    'qbmSD': function (_0x72c2f1, _0x5879ba) {
      return _0x72c2f1 * _0x5879ba;
    },
    'sgpqq': function (_0x19b769, _0x459dc4) {
      return _0x19b769 - _0x459dc4;
    },
    'dMyhf': function (_0x4f2a7f, _0xdb91ad) {
      return _0x4f2a7f(_0xdb91ad);
    },
    'QWncl': function (_0x14de15, _0x533fac) {
      return _0x14de15 * _0x533fac;
    },
    'nDLJb': 'power2.out',
    'cWoEz': function (_0x3b2409, _0xe936f5) {
      return _0x3b2409 + _0xe936f5;
    },
    'iNZiW': 'none',
    'FFvNl': function (_0x13e897, _0x6635e8) {
      return _0x13e897 - _0x6635e8;
    },
    'rfEqj': function (_0x49ea91, _0x51e0be) {
      return _0x49ea91 || _0x51e0be;
    },
    'GxRVY': '[data-step]',
    'hUebr': function (_0x205f8f, _0x12735a) {
      return _0x205f8f < _0x12735a;
    },
    'siAcX': function (_0x279cf2, _0x384d1a) {
      return _0x279cf2 - _0x384d1a;
    },
    'HyEOW': function (_0x3946b7, _0x3072e3) {
      return _0x3946b7 * _0x3072e3;
    },
    'Nssoy': function (_0x18c436, _0x41013e, _0x3a7dc0) {
      return _0x18c436(_0x41013e, _0x3a7dc0);
    },
    'sgHMW': "[data-story-rail]",
    'QrInF': function (_0x302b4f, _0x5b6e73) {
      return _0x302b4f < _0x5b6e73;
    },
    'MSwDl': "4|0|1|6|3|5|2|7",
    'scWMf': '[data-how-card]',
    'vQFtv': 'top\x2075%',
    'SAqXJ': "bottom 65%",
    'ReqZK': "[data-how-grid]",
    'aKGKh': "2|6|5|3|1|4|7|0",
    'dvNBq': "power3.out",
    'KfxcC': "aria-expanded",
    'rGvgj': 'true',
    'JllLq': "data-faq-open",
    'lCPwB': "click",
    'AEVQR': "pt-is-open",
    'ySqXm': "height",
    'LrRFi': 'visible',
    'RmkQT': '[data-hero-fade]',
    'ecLwo': "[data-story-stage]",
    'YLEKE': '[data-step-aside]',
    'POhOU': 'button',
    'XgtEN': "pt-rail-num",
    'iyXjm': function (_0xd6fcce, _0x3ff8bf) {
      return _0xd6fcce(_0x3ff8bf);
    },
    'rBWsg': function (_0x244350, _0x1cc3e6) {
      return _0x244350 * _0x1cc3e6;
    },
    'ZoNIy': function (_0xb91e7a, _0x34815e) {
      return _0xb91e7a / _0x34815e;
    },
    'rdGth': 'en-GB',
    'iANxn': "auto",
    'Fqgrq': "false",
    'vSzCz': "[data-billing-status]",
    'zBxTy': function (_0x4a9d38) {
      return _0x4a9d38();
    },
    'pWYZg': '[data-section=\x22story\x22]',
    'UEQEj': function (_0x4cc96c, _0x3fed9d) {
      return _0x4cc96c(_0x3fed9d);
    },
    'kGOEe': '[data-section=\x22pricing\x22]',
    'yByDG': '(pointer:\x20fine)\x20and\x20(prefers-reduced-motion:\x20no-preference)',
    'MXlXB': "(prefers-reduced-motion: no-preference)",
    'lUbxV': "beforeunload"
  };
  if (typeof gsap === _0x449e7b['mormG'] || typeof ScrollTrigger === _0x449e7b['mormG']) {
    document["documentElement"]['classList']["remove"]("pt-has-js"), document["documentElement"]["classList"]["remove"]("pt-gl");
    return;
  }
  gsap['registerPlugin'](ScrollTrigger);
  var hasSplitText = typeof SplitText !== "undefined";
  if (hasSplitText) gsap["registerPlugin"](SplitText);
  function initLenis() {
    var _0x174920 = _0x449e7b["IBYOQ"](new URLSearchParams(location['search'])["get"](_0x449e7b["EZKIw"]) || document['documentElement']['dataset']['smooth'], _0x449e7b["fbbTE"]);
    if (!_0x174920 || _0x449e7b["pELhW"](typeof Lenis, _0x449e7b['mormG']) || window['lenis']) return null;
    var previousLenis = window["lenis"],
      _0x33da08 = window["destroyLenis"],
      _0x2c27fe = _0x449e7b['IBYOQ'](typeof gsap, _0x449e7b['mormG']) && _0x449e7b['wFHcH'](typeof ScrollTrigger, 'undefined'),
      _0x4d18e7 = {};
    _0x4d18e7["autoRaf"] = !_0x2c27fe, _0x4d18e7['allowNestedScroll'] = !![];
    var _0x239c01 = new Lenis(_0x4d18e7),
      _0x2a8025 = ![],
      _0x27d01e = function (_0x1fb55a) {
        _0x239c01['raf'](_0x1fb55a * 0x3e8);
      },
      _0x33fc64 = function () {
        var _0xf98233 = {};
        _0xf98233["immediate"] = !![], _0xf98233["force"] = !![], _0x239c01['scrollTo'](window["scrollY"], _0xf98233);
      };
    _0x2c27fe && (_0x239c01['on']("scroll", ScrollTrigger['update']), gsap["ticker"]['add'](_0x27d01e), gsap["ticker"]["lagSmoothing"](0x0), ScrollTrigger["addEventListener"]('refresh', _0x33fc64));
    var _0x5e3ef4 = function () {
      var _0x641285 = _0x449e7b["MAavm"]["split"]('|'),
        _0xacdfa9 = 0x0;
      while (!![]) {
        switch (_0x641285[_0xacdfa9++]) {
          case '0':
            if (window['lenis'] === _0x239c01) {
              if (_0x449e7b['IKDGL'](previousLenis, undefined)) delete window["lenis"];else window['lenis'] = previousLenis;
            }
            continue;
          case '1':
            _0x2a8025 = !![];
            continue;
          case '2':
            if (_0x2a8025) return;
            continue;
          case '3':
            if (_0x449e7b["IKDGL"](window['destroyLenis'], _0x5e3ef4)) {
              if (_0x33da08 === undefined) delete window["destroyLenis"];else window["destroyLenis"] = _0x33da08;
            }
            continue;
          case '4':
            _0x2c27fe && (gsap['ticker']['remove'](_0x27d01e), ScrollTrigger['removeEventListener'](_0x449e7b['lfSMb'], _0x33fc64));
            continue;
          case '5':
            _0x239c01['destroy']();
            continue;
        }
        break;
      }
    };
    return window["lenis"] = _0x239c01, window["destroyLenis"] = _0x5e3ef4, _0x5e3ef4;
  }
  var _0x1705ac = window["gsapContext"],
    _0x379f62 = gsap['context'](function (_0x250523) {
      var _0x3317cf = {
          'ymrQh': "1|3|4|5|2|0",
          'GbxLX': function (_0x3749b4, _0x563452) {
            return _0x449e7b["dMyhf"](_0x3749b4, _0x563452);
          },
          'LeLjb': "a[href^=\"#\"]",
          'XlDey': 'visibility',
          'LpipW': _0x449e7b['LrRFi'],
          'artBV': "sine.inOut",
          'qYEiN': '[data-hero-title]',
          'XPmho': _0x449e7b['RmkQT'],
          'bRFRr': "power3.out",
          'WWwhC': _0x449e7b['ecLwo'],
          'XOujV': function (_0x3432ab, _0x528e49) {
            return _0x3432ab && _0x528e49;
          },
          'oagZX': 'img[data-screen]',
          'dVhgA': function (_0x499ffc, _0x369b8c) {
            return _0x499ffc === _0x369b8c;
          },
          'SwHHn': '[data-step-label]',
          'GXgRd': "[data-step-copy]",
          'XDXEB': _0x449e7b["YLEKE"],
          'DlYeD': function (_0x5a1b6a, _0x165527) {
            return _0x449e7b['dMyhf'](_0x5a1b6a, _0x165527);
          },
          'gkPqB': '--tone',
          'vmIUn': '7|5|3|8|11|12|1|4|6|0|9|10|2',
          'MqXMU': "span",
          'Mgllf': 'Step\x20',
          'EfbCY': _0x449e7b['POhOU'],
          'xHrpM': _0x449e7b['XgtEN'],
          'tiMsC': function (_0x43af32, _0x59ca79) {
            return _0x449e7b["iyXjm"](_0x43af32, _0x59ca79);
          },
          'WzOGQ': function (_0x8de05, _0x2d587b) {
            return _0x449e7b["cWoEz"](_0x8de05, _0x2d587b);
          },
          'uAcBd': function (_0x177f2b, _0xa3aa90) {
            return _0x449e7b['QWncl'](_0x177f2b, _0xa3aa90);
          },
          'tZMpp': function (_0xf5c926, _0x4705c5) {
            return _0x449e7b["rBWsg"](_0xf5c926, _0x4705c5);
          },
          'CQDlq': function (_0x242737, _0x1c378f) {
            return _0x242737 >= _0x1c378f;
          },
          'rQfIf': function (_0x3e7752, _0x2c6fbd) {
            return _0x449e7b["ZoNIy"](_0x3e7752, _0x2c6fbd);
          },
          'Tfuke': 'top\x2088%',
          'FrWyi': _0x449e7b["rdGth"],
          'WxHhI': "top 90%",
          'OlbBN': "data-count-text",
          'BxBdN': function (_0x5cf80f, _0x4edd09) {
            return _0x449e7b["rfEqj"](_0x5cf80f, _0x4edd09);
          },
          'BloeS': function (_0x8e74c0, _0x1bb917) {
            return _0x449e7b["dMyhf"](_0x8e74c0, _0x1bb917);
          },
          'kbLOg': function (_0x1a532e, _0x2ba5db) {
            return _0x449e7b['cWoEz'](_0x1a532e, _0x2ba5db);
          },
          'WoBZZ': _0x449e7b['iANxn'],
          'eyVwF': 'aria-pressed',
          'TSLpn': _0x449e7b["Fqgrq"],
          'kLCFD': '[data-billing-thumb]',
          'vcUns': _0x449e7b["vSzCz"],
          'eaInz': _0x449e7b["lfSMb"],
          'SrhgC': "undefined",
          'jYMQF': function (_0x54d191) {
            return _0x449e7b['zBxTy'](_0x54d191);
          },
          'fMdiY': function (_0x565dfd, _0x2347a8, _0x324f01) {
            return _0x565dfd(_0x2347a8, _0x324f01);
          },
          'IeChX': "[data-section=\"hero\"]",
          'HNQkO': function (_0x3a552c, _0x18ce16, _0x2616fd) {
            return _0x449e7b["Nssoy"](_0x3a552c, _0x18ce16, _0x2616fd);
          },
          'pGEYi': _0x449e7b["pWYZg"],
          'qzYyq': function (_0x1ed8e6, _0x502d78) {
            return _0x449e7b["UEQEj"](_0x1ed8e6, _0x502d78);
          },
          'rHxDC': function (_0x5a921e, _0x2c525a) {
            return _0x449e7b['dMyhf'](_0x5a921e, _0x2c525a);
          },
          'FdPxL': _0x449e7b['kGOEe'],
          'RLyTK': function (_0x2ae950, _0x126c78) {
            return _0x449e7b['iyXjm'](_0x2ae950, _0x126c78);
          },
          'uiZAR': "[data-section=\"faq\"]",
          'nIWqS': "beforeunload",
          'TWgDF': function (_0x4951ca, _0x37b426) {
            return _0x4951ca === _0x37b426;
          }
        },
        _0x4e1fb7 = gsap['matchMedia'](),
        _0x1fe5ee = [],
        _0x4161da,
        _0x375825 = !![];
      function _0x427a0c(_0x40f894, _0x1904a0, _0xdff6ea) {
        var _0x2dfbd6 = _0x4161da['add'](null, _0xdff6ea);
        _0x40f894["addEventListener"](_0x1904a0, _0x2dfbd6), _0x1fe5ee["push"](function () {
          _0x40f894["removeEventListener"](_0x1904a0, _0x2dfbd6);
        });
      }
      function _0x256f34(_0x469d4a) {
        var _0x2d840c = {};
        _0x2d840c["duration"] = 1.1;
        if (window['lenis']) window["lenis"]["scrollTo"](_0x469d4a, _0x2d840c);else window['scrollTo']({
          'top': _0x469d4a,
          'behavior': _0x375825 ? "smooth" : "auto"
        });
      }
      function _0x55760b() {
        var _0x4679ef = document['querySelectorAll'](_0x3317cf["LeLjb"]);
        _0x4679ef['forEach'](function (_0x10892a) {
          var _0x1188fd = _0x3317cf["ymrQh"]['split']('|'),
            _0x4b8a6e = 0x0;
          while (!![]) {
            switch (_0x1188fd[_0x4b8a6e++]) {
              case '0':
                _0x427a0c(_0x10892a, "click", function (_0x137b66) {
                  if (_0x137b66["metaKey"] || _0x137b66['ctrlKey'] || _0x137b66['shiftKey'] || _0x137b66["altKey"] || _0x137b66["button"]) return;
                  _0x137b66['preventDefault']();
                  var _0x33386e = _0x5d18fc["parentElement"] && _0x5d18fc['parentElement']['classList']['contains'](_0x45e954["mfBBM"]) ? _0x5d18fc['parentElement'] : null,
                    _0x55ee32 = _0x45e954['rOGjV']((_0x33386e || _0x5d18fc)["getBoundingClientRect"]()["top"], window['scrollY']);
                  _0x45e954['nrgxY'](_0x256f34, _0x192736 === _0x45e954['blyIZ'] ? 0x0 : _0x55ee32);
                  if (history['replaceState']) history["replaceState"](null, '', _0x45e954["rOGjV"]('#', _0x192736));
                });
                continue;
              case '1':
                var _0x45e954 = {
                  'mfBBM': "pin-spacer",
                  'rOGjV': function (_0x16a869, _0x6aa9e9) {
                    return _0x16a869 + _0x6aa9e9;
                  },
                  'nrgxY': function (_0xff2847, _0x4d89a5) {
                    return _0x3317cf['GbxLX'](_0xff2847, _0x4d89a5);
                  },
                  'blyIZ': "top"
                };
                continue;
              case '2':
                if (!_0x5d18fc) return;
                continue;
              case '3':
                var _0x192736 = _0x10892a["getAttribute"]('href')['slice'](0x1);
                continue;
              case '4':
                if (!_0x192736) return;
                continue;
              case '5':
                var _0x5d18fc = document["getElementById"](_0x192736);
                continue;
            }
            break;
          }
        });
      }
      function _0x47be07(_0x3e2d97, _0x2024e1) {
        var _0x11bab5 = {
          'Wbnrm': _0x3317cf['LpipW'],
          'RtRZi': "lines",
          'WLjSB': function (_0x113fa2, _0x41d0b9, _0x17322d) {
            return _0x113fa2(_0x41d0b9, _0x17322d);
          },
          'BSIDT': '-=9',
          'GrpWo': _0x3317cf['artBV'],
          'psbfL': function (_0x232a84, _0x57bf0a) {
            return _0x232a84 + _0x57bf0a;
          }
        };
        if (!_0x3e2d97) return;
        var _0x4f328b = _0x3e2d97["querySelector"](_0x3317cf["qYEiN"]),
          _0x101c72 = _0x3e2d97['querySelectorAll'](_0x3317cf['XPmho']),
          _0x2503f2 = _0x3e2d97['querySelectorAll'](".pt-chip"),
          _0x36a1f0 = null;
        function _0x2ad223() {
          var _0x44c0ae = {};
          _0x44c0ae["DqZQu"] = _0x11bab5['Wbnrm'], _0x44c0ae["zisSU"] = "power4.out";
          var _0x65646 = _0x44c0ae;
          if (!_0x4f328b) return;
          if (hasSplitText) _0x36a1f0 = SplitText["create"](_0x4f328b, {
            'type': _0x11bab5['RtRZi'],
            'mask': _0x11bab5['RtRZi'],
            'autoSplit': !![],
            'onSplit': function (_0x5b701b) {
              var _0x5c7ada = {};
              _0x5c7ada['visibility'] = _0x65646['DqZQu'], gsap['set'](_0x4f328b, _0x5c7ada);
              var _0x56c2dd = {};
              _0x56c2dd['yPercent'] = 0x6e;
              var _0x26e4a4 = {};
              return _0x26e4a4['yPercent'] = 0x0, _0x26e4a4["duration"] = 1.1, _0x26e4a4["stagger"] = 0.12, _0x26e4a4['ease'] = _0x65646["zisSU"], gsap['fromTo'](_0x5b701b['lines'], _0x56c2dd, _0x26e4a4);
            }
          });else {
            var _0x2293b0 = {};
            _0x2293b0['visibility'] = 'visible', gsap['set'](_0x4f328b, _0x2293b0);
          }
        }
        var _0x378c7b = document["fonts"] && document['fonts']['ready'] ? Promise["race"]([document['fonts']['ready'], new Promise(function (_0x559fbb) {
          _0x11bab5['WLjSB'](setTimeout, _0x559fbb, 0x5dc);
        })]) : Promise["resolve"]();
        _0x378c7b['then'](_0x4161da["add"](null, _0x2ad223));
        if (_0x101c72["length"]) {
          var _0x23ff05 = {};
          _0x23ff05['opacity'] = 0x0, _0x23ff05['y'] = 0x18;
          var _0x1ba9d6 = {};
          _0x1ba9d6['opacity'] = 0x1, _0x1ba9d6['y'] = 0x0, _0x1ba9d6["duration"] = 0.8, _0x1ba9d6["stagger"] = 0.1, _0x1ba9d6["delay"] = 0.4, _0x1ba9d6['ease'] = _0x3317cf['bRFRr'], gsap['fromTo'](_0x101c72, _0x23ff05, _0x1ba9d6);
        }
        if (_0x2503f2["length"]) {
          var _0x547149 = {};
          _0x547149['visibility'] = "hidden", _0x547149['y'] = 0x1e, _0x547149['scale'] = 0.55;
          var _0x55d5df = {};
          _0x55d5df["visibility"] = "visible", _0x55d5df['y'] = 0x0, _0x55d5df["scale"] = 0x1, _0x55d5df["duration"] = 0.9, _0x55d5df["stagger"] = 0.16, _0x55d5df['delay'] = 0.9, _0x55d5df['ease'] = 'back.out(1.6)', gsap['fromTo'](_0x2503f2, _0x547149, _0x55d5df), _0x2503f2['forEach'](function (_0x2f72a8, _0x559452) {
            gsap['to'](_0x2f72a8, {
              'y': _0x11bab5['BSIDT'],
              'duration': 2.6 + _0x559452 * 0.5,
              'ease': _0x11bab5["GrpWo"],
              'repeat': -0x1,
              'yoyo': !![],
              'delay': _0x11bab5['psbfL'](0x2, _0x559452 * 0.3)
            });
          });
        }
        return function _0xed5a96() {
          if (_0x36a1f0) _0x36a1f0['revert']();
          var _0x37162e = {};
          _0x37162e['clearProps'] = _0x3317cf["XlDey"];
          if (_0x4f328b) gsap['set'](_0x4f328b, _0x37162e);
        };
      }
      function _0x3c7d6b() {
        var _0x33878e = document['querySelector']("[data-phone-slot=\"hero\"]"),
          _0x4c991c = document['querySelector']('[data-phone-slot=\x22story\x22]'),
          _0x417e78 = document["querySelector"](_0x3317cf["WWwhC"]);
        if (_0x3317cf['XOujV'](!_0x33878e, !_0x4c991c)) return null;
        var _0x150d3d = [];
        if (_0x33878e) _0x150d3d['push'](_0x33878e['querySelector'](_0x3317cf["oagZX"]));
        document['querySelectorAll']("[data-step] img[data-screen]")['forEach'](function (_0x474f5e) {
          _0x150d3d["push"](_0x474f5e);
        }), _0x150d3d = _0x150d3d['filter'](Boolean);
        if (!_0x150d3d['length']) return null;
        var _0x144612 = _0x3317cf["GbxLX"](buildPhone, {
          'heroSlot': _0x33878e,
          'storySlot': _0x4c991c,
          'stage': _0x417e78,
          'screens': _0x150d3d,
          'isFine': window['matchMedia']('(pointer:\x20fine)')["matches"]
        });
        if (!_0x144612) return null;
        return _0x144612['pose']['intro'] = _0x144612['introOn'] ? 0x0 : 0x1, _0x144612['ready']["then"](_0x4161da['add'](null, function () {
          if (!_0x144612['introOn']) return;
          var _0x205d5b = {};
          _0x205d5b["intro"] = 0x1, _0x205d5b["duration"] = 1.9, _0x205d5b["delay"] = 0.1, _0x205d5b["ease"] = _0x3317cf["bRFRr"], gsap['to'](_0x144612["pose"], _0x205d5b);
        })), _0x144612;
      }
      function _0x47edf8(_0xfe68b0, _0x139ab3) {
        var _0x1df518 = {
          'aTZnh': "aria-current",
          'TnngH': function (_0x153615, _0x477f5c) {
            return _0x449e7b['OWxqz'](_0x153615, _0x477f5c);
          },
          'UPrCD': function (_0x18ad6f, _0x235768) {
            return _0x449e7b["qbmSD"](_0x18ad6f, _0x235768);
          },
          'HlNSd': function (_0x341c0d, _0x16ebd6) {
            return _0x341c0d + _0x16ebd6;
          },
          'kuOeC': function (_0x432b59, _0x2e1418) {
            return _0x449e7b["sgpqq"](_0x432b59, _0x2e1418);
          },
          'RnOnj': function (_0x2f4b2a, _0x3bc25f) {
            return _0x2f4b2a * _0x3bc25f;
          },
          'sjBoQ': function (_0x10c938, _0x4c8bb0) {
            return _0x449e7b["dMyhf"](_0x10c938, _0x4c8bb0);
          },
          'jWbbT': function (_0x3075de, _0x383010) {
            return _0x449e7b['QWncl'](_0x3075de, _0x383010);
          },
          'MbBfL': function (_0x42637d, _0xc17075) {
            return _0x42637d * _0xc17075;
          },
          'VNsPI': function (_0x23c0cc, _0x16f144) {
            return _0x23c0cc / _0x16f144;
          },
          'PnKaU': "power1.inOut",
          'mjOiP': _0x449e7b["nDLJb"],
          'guhZa': function (_0x2b1467, _0x174231) {
            return _0x449e7b['cWoEz'](_0x2b1467, _0x174231);
          },
          'sxnUP': function (_0x16ba7d, _0x33802d) {
            return _0x16ba7d * _0x33802d;
          },
          'QtJel': _0x449e7b["iNZiW"],
          'glbTP': function (_0x4488c3, _0x54c30f) {
            return _0x449e7b["FFvNl"](_0x4488c3, _0x54c30f);
          }
        };
        if (_0x449e7b['rfEqj'](!_0xfe68b0, !_0x139ab3)) return null;
        var _0x39c2be = _0xfe68b0["querySelector"]("[data-story-stage]"),
          _0x16d3a0 = Array['prototype']['slice']['call'](_0xfe68b0["querySelectorAll"](_0x449e7b['GxRVY'])),
          _0x863218 = _0x16d3a0["length"];
        if (!_0x39c2be || _0x449e7b["hUebr"](_0x863218, 0x2)) return null;
        var _0x5dd201 = 0.5,
          _0x671487 = 0.5,
          _0x596f46 = _0x449e7b["cWoEz"](_0x449e7b['siAcX'](_0x863218, 0x1), _0x5dd201),
          _0x29f795 = _0x449e7b['HyEOW'](_0x449e7b['Nssoy'](num, _0xfe68b0["dataset"]['spin'], 0x168), Math['PI']) / 0xb4,
          _0x4b1d46 = _0x139ab3["pose"];
        function _0x4983a6(_0x11f04b) {
          return _0x3317cf['dVhgA'](_0x11f04b % 0x2, 0x0) ? -0.3 : 0.3;
        }
        var _0x460cb2 = _0x16d3a0["map"](function (_0x1f4920) {
            var _0x1a2b8e = _0x1f4920["querySelector"](_0x3317cf["SwHHn"]);
            return {
              'step': _0x1f4920,
              'copy': _0x1f4920['querySelector'](_0x3317cf["GXgRd"]),
              'aside': _0x1f4920['querySelector'](_0x3317cf['XDXEB']),
              'tone': _0x3317cf["DlYeD"](getComputedStyle, _0x1f4920)['getPropertyValue'](_0x3317cf['gkPqB'])["trim"](),
              'label': _0x1a2b8e ? _0x1a2b8e['textContent']["trim"]() : ''
            };
          }),
          _0x519a8a = _0xfe68b0["querySelector"](_0x449e7b['sgHMW']),
          _0x4725c0 = [];
        _0x519a8a && _0x460cb2['forEach'](function (_0x15a737, _0x5696a7) {
          var _0xa47d4d = _0x3317cf['vmIUn']['split']('|'),
            _0x3e0deb = 0x0;
          while (!![]) {
            switch (_0xa47d4d[_0x3e0deb++]) {
              case '0':
                _0x516c32["appendChild"](_0x4ca2bf);
                continue;
              case '1':
                var _0x475945 = document["createElement"]("span");
                continue;
              case '2':
                _0x4725c0["push"](_0x516c32);
                continue;
              case '3':
                var _0x4ca2bf = document['createElement'](_0x3317cf['MqXMU']);
                continue;
              case '4':
                _0x475945['className'] = "pt-rail-label";
                continue;
              case '5':
                _0x516c32["type"] = "button";
                continue;
              case '6':
                _0x475945['textContent'] = _0x15a737['label'] || _0x3317cf['Mgllf'] + (_0x5696a7 + 0x1);
                continue;
              case '7':
                var _0x516c32 = document["createElement"](_0x3317cf['EfbCY']);
                continue;
              case '8':
                _0x4ca2bf["className"] = _0x3317cf['xHrpM'];
                continue;
              case '9':
                _0x516c32["appendChild"](_0x475945);
                continue;
              case '10':
                _0x519a8a['appendChild'](_0x516c32);
                continue;
              case '11':
                _0x4ca2bf["textContent"] = _0x3317cf["tiMsC"](String, _0x5696a7 + 0x1)['padStart'](0x2, '0');
                continue;
              case '12':
                _0x4ca2bf['setAttribute']("aria-hidden", "true");
                continue;
            }
            break;
          }
        });
        var _0x2325d4 = {};
        _0x2325d4['backgroundColor'] = _0x460cb2[0x0]['tone'], gsap["set"](_0x39c2be, _0x2325d4);
        var _0x4de7e1 = -0x1;
        function _0x35c422(_0xbcbf47) {
          if (_0x1df518['TnngH'](_0xbcbf47, _0x4de7e1)) return;
          _0x4de7e1 = _0xbcbf47, _0x4725c0['forEach'](function (_0x831213, _0x50c89c) {
            if (_0x50c89c === _0xbcbf47) _0x831213["setAttribute"]('aria-current', 'step');else _0x831213["removeAttribute"](_0x1df518["aTZnh"]);
          });
        }
        _0x35c422(0x0);
        var _0x19be39 = {};
        _0x19be39["ease"] = _0x449e7b['iNZiW'];
        var _0x4a5856 = gsap['timeline']({
          'defaults': _0x19be39,
          'scrollTrigger': {
            'trigger': _0x39c2be,
            'start': "top top",
            'end': function () {
              return _0x3317cf["WzOGQ"]('+=', Math["round"](_0x3317cf['uAcBd'](_0x596f46, window["innerHeight"]) * 0.95));
            },
            'pin': !![],
            'scrub': 0.4,
            'invalidateOnRefresh': !![],
            'onUpdate': function (_0xe564ac) {
              var _0x8e9373 = _0x3317cf['tZMpp'](_0xe564ac["progress"], _0x596f46),
                _0x4bae98 = 0x0;
              for (var _0x136686 = 0x1; _0x136686 < _0x863218; _0x136686++) if (_0x3317cf["CQDlq"](_0x8e9373, _0x3317cf["WzOGQ"](_0x136686 - 0x1, _0x5dd201) + _0x3317cf["rQfIf"](_0x671487, 0x2))) _0x4bae98 = _0x136686;
              _0x35c422(_0x4bae98);
            }
          }
        });
        for (var _0x318dad = 0x1; _0x449e7b["QrInF"](_0x318dad, _0x863218); _0x318dad++) {
          (function (_0x4f9500) {
            var _0x5289e3 = '3|11|8|5|9|1|4|7|10|2|0|6'["split"]('|'),
              _0x252b79 = 0x0;
            while (!![]) {
              switch (_0x5289e3[_0x252b79++]) {
                case '0':
                  var _0x20465e = {};
                  _0x20465e['pop'] = 0x0;
                  var _0x580815 = {};
                  _0x580815["pop"] = 0x1, _0x580815['duration'] = _0x671487 / 0x2, _0x580815["ease"] = "sine.out", _0x580815['immediateRender'] = ![], _0x4a5856["fromTo"](_0x4b1d46, _0x20465e, _0x580815, _0x4bf4be);
                  continue;
                case '1':
                  if (_0x742d57["aside"]) _0x4a5856['to'](_0x742d57["aside"], {
                    'opacity': 0x0,
                    'x': 0x18,
                    'duration': _0x1df518['UPrCD'](_0x671487, 0.4),
                    'ease': 'power2.in'
                  }, _0x4bf4be);
                  continue;
                case '2':
                  _0x4a5856["fromTo"](_0x4b1d46, {
                    'ry': _0x1df518["HlNSd"](_0x4983a6(_0x1df518['kuOeC'](_0x4f9500, 0x1)), _0x1df518["RnOnj"](_0x4f9500, _0x29f795))
                  }, {
                    'ry': _0x1df518["sjBoQ"](_0x4983a6, _0x4f9500) + _0x1df518['jWbbT'](_0x4f9500 + 0x1, _0x29f795),
                    'duration': _0x671487,
                    'ease': "power2.inOut",
                    'immediateRender': ![]
                  }, _0x4bf4be);
                  continue;
                case '3':
                  var _0x4bf4be = _0x4f9500 - 0x1 + _0x5dd201;
                  continue;
                case '4':
                  var _0x3999b3 = {};
                  _0x3999b3["opacity"] = 0x0, _0x3999b3['x'] = -0x18;
                  var _0x4f68c9 = {};
                  _0x4f68c9["opacity"] = 0x1, _0x4f68c9['x'] = 0x0, _0x4f68c9['duration'] = _0x671487 * 0.45, _0x4f68c9["ease"] = 'power2.out';
                  if (_0x1278b7["aside"]) _0x4a5856["fromTo"](_0x1278b7["aside"], _0x3999b3, _0x4f68c9, _0x1df518["HlNSd"](_0x4bf4be, _0x671487 * 0.55));
                  continue;
                case '5':
                  if (_0x742d57['copy']) _0x4a5856['to'](_0x742d57["copy"], {
                    'opacity': 0x0,
                    'y': -0x1c,
                    'duration': _0x1df518["MbBfL"](_0x671487, 0.45),
                    'ease': "power2.in"
                  }, _0x4bf4be);
                  continue;
                case '6':
                  var _0x50e51c = {};
                  _0x50e51c['pop'] = 0x1;
                  var _0x28baee = {};
                  _0x28baee["pop"] = 0x0, _0x28baee["duration"] = _0x671487 / 0x2, _0x28baee['ease'] = "sine.in", _0x28baee["immediateRender"] = ![], _0x4a5856["fromTo"](_0x4b1d46, _0x50e51c, _0x28baee, _0x4bf4be + _0x1df518["VNsPI"](_0x671487, 0x2));
                  continue;
                case '7':
                  var _0x4cc2d8 = {};
                  _0x4cc2d8['backgroundColor'] = _0x1278b7["tone"], _0x4cc2d8["duration"] = _0x671487, _0x4cc2d8['ease'] = _0x1df518["PnKaU"], _0x4a5856['to'](_0x39c2be, _0x4cc2d8, _0x4bf4be);
                  continue;
                case '8':
                  var _0x1278b7 = _0x460cb2[_0x4f9500];
                  continue;
                case '9':
                  var _0x147031 = {};
                  _0x147031["opacity"] = 0x0, _0x147031['y'] = 0x1c;
                  if (_0x1278b7['copy']) _0x4a5856["fromTo"](_0x1278b7["copy"], _0x147031, {
                    'opacity': 0x1,
                    'y': 0x0,
                    'duration': _0x1df518["RnOnj"](_0x671487, 0.45),
                    'ease': _0x1df518["mjOiP"]
                  }, _0x1df518['guhZa'](_0x4bf4be, _0x1df518['sxnUP'](_0x671487, 0.5)));
                  continue;
                case '10':
                  var _0x40111f = {};
                  _0x40111f['screen'] = _0x4f9500, _0x4a5856["fromTo"](_0x4b1d46, _0x40111f, {
                    'screen': _0x1df518['HlNSd'](_0x4f9500, 0x1),
                    'duration': _0x671487,
                    'ease': _0x1df518['QtJel'],
                    'immediateRender': ![]
                  }, _0x4bf4be);
                  continue;
                case '11':
                  var _0x742d57 = _0x460cb2[_0x4f9500 - 0x1];
                  continue;
              }
              break;
            }
          })(_0x318dad);
        }
        var _0x4d1dc7 = {};
        _0x4d1dc7['duration'] = _0x5dd201, _0x4a5856['to']({}, _0x4d1dc7, _0x863218 - 0x1);
        var _0x4a0c39 = _0x4a5856["scrollTrigger"];
        _0x139ab3['setPinEnd'](function () {
          return _0x4a0c39["end"];
        });
        var _0x5a6fab = gsap['timeline']({
            'scrollTrigger': {
              'start': 0x0,
              'end': function () {
                return Math["max"](0x1, _0xfe68b0['getBoundingClientRect']()['top'] + window['scrollY']);
              },
              'scrub': 0.4,
              'invalidateOnRefresh': !![]
            }
          }),
          _0x402d03 = {};
        _0x402d03["glide"] = 0x0, _0x402d03['ry'] = 0x0, _0x5a6fab["fromTo"](_0x4b1d46, _0x402d03, {
          'glide': 0x1,
          'ry': _0x449e7b['dMyhf'](_0x4983a6, 0x0) + _0x29f795,
          'duration': 0x1,
          'ease': 'power2.inOut',
          'immediateRender': ![]
        }, 0x0);
        var _0xe358b2 = {};
        _0xe358b2['screen'] = 0x0;
        var _0x53cd9e = {};
        return _0x53cd9e['screen'] = 0x1, _0x53cd9e['duration'] = 0x1, _0x53cd9e['ease'] = "none", _0x53cd9e['immediateRender'] = ![], _0x5a6fab['fromTo'](_0x4b1d46, _0xe358b2, _0x53cd9e, 0x0), _0x4725c0['forEach'](function (_0x16bf04, _0x2a8258) {
          var _0x16cd0e = {
            'CYnHW': function (_0x2c1449, _0x45b210) {
              return _0x1df518["glbTP"](_0x2c1449, _0x45b210);
            },
            'hUHfg': function (_0x12eab2, _0x310ee2) {
              return _0x12eab2 + _0x310ee2;
            }
          };
          _0x427a0c(_0x16bf04, 'click', function () {
            var _0x5ecfd2 = _0x16cd0e["CYnHW"](_0x4a0c39["end"], _0x4a0c39["start"]);
            _0x256f34(_0x16cd0e["hUHfg"](_0x16cd0e["hUHfg"](_0x4a0c39['start'], _0x5ecfd2 * (_0x2a8258 / _0x596f46)), _0x2a8258 === 0x0 ? 0x2 : 0x4));
          });
        }), function _0x51040b() {
          _0x4725c0["forEach"](function (_0x587dfd) {
            _0x587dfd['remove']();
          });
        };
      }
      function _0xff10b5() {
        var _0x55de7a = document["querySelectorAll"]('[data-reveal]');
        _0x55de7a["length"] && ScrollTrigger['batch'](_0x55de7a, {
          'start': _0x3317cf['Tfuke'],
          'once': !![],
          'onEnter': function (_0x4a877b) {
            var _0x425e67 = {};
            _0x425e67['opacity'] = 0x0, _0x425e67['y'] = 0x20;
            var _0x599eb4 = {};
            _0x599eb4["opacity"] = 0x1, _0x599eb4['y'] = 0x0, _0x599eb4["duration"] = 0.8, _0x599eb4["stagger"] = 0.1, _0x599eb4["ease"] = 'power3.out', _0x599eb4["overwrite"] = !![], gsap["fromTo"](_0x4a877b, _0x425e67, _0x599eb4);
          }
        }), document['querySelectorAll']('[data-reveal-group]')['forEach'](function (_0x25c979) {
          ScrollTrigger["create"]({
            'trigger': _0x25c979,
            'start': "top 86%",
            'once': !![],
            'onEnter': function () {
              var _0x17f02b = {};
              _0x17f02b["opacity"] = 0x0, _0x17f02b['y'] = 0x1a;
              var _0x3dea84 = {};
              _0x3dea84['opacity'] = 0x1, _0x3dea84['y'] = 0x0, _0x3dea84['duration'] = 0.75, _0x3dea84['stagger'] = 0.09, _0x3dea84["ease"] = 'power3.out', gsap['fromTo'](_0x25c979["children"], _0x17f02b, _0x3dea84);
            }
          });
        });
      }
      function _0x51e8f4(_0x2cab03) {
        var _0x3f6181 = {};
        _0x3f6181["JdPqq"] = _0x3317cf['OlbBN'];
        var _0xd1efb9 = _0x3f6181;
        if (!_0x2cab03) return;
        var _0x5022c8 = _0x2cab03["querySelectorAll"]("[data-count]");
        return _0x5022c8["forEach"](function (_0x108694) {
          var _0x5b3f9a = {
              'sOAYB': function (_0x195a3b, _0x5ad050) {
                return _0x3317cf['WzOGQ'](_0x195a3b, _0x5ad050);
              },
              'uoCWM': _0x3317cf['FrWyi'],
              'gqFoO': function (_0x1e85d9) {
                return _0x1e85d9();
              }
            },
            _0x43bbe5 = _0x108694['textContent']['trim'](),
            _0x1330db = _0x43bbe5['match'](/^(\D*)([\d.,]+)(.*)$/);
          if (!_0x1330db) return;
          var _0x259c9d = _0x1330db[0x1],
            _0x2021f7 = _0x1330db[0x2],
            _0x4b6ed0 = _0x1330db[0x3],
            _0x4b13cc = _0x2021f7["indexOf"]('.') > -0x1 ? _0x2021f7["split"]('.')[0x1]["length"] : 0x0,
            _0x1b8689 = parseFloat(_0x2021f7["replace"](/,/g, ''));
          _0x108694['setAttribute']('data-count-text', _0x43bbe5);
          var _0x41a14b = {};
          _0x41a14b['v'] = 0x0;
          var _0x16d0d9 = _0x41a14b;
          function _0x2affb() {
            var _0x333b20 = {};
            _0x333b20['minimumFractionDigits'] = _0x4b13cc, _0x333b20["maximumFractionDigits"] = _0x4b13cc, _0x108694['textContent'] = _0x5b3f9a['sOAYB'](_0x5b3f9a["sOAYB"](_0x259c9d, _0x16d0d9['v']["toLocaleString"](_0x5b3f9a["uoCWM"], _0x333b20)), _0x4b6ed0);
          }
          ScrollTrigger["create"]({
            'trigger': _0x108694,
            'start': _0x3317cf['WxHhI'],
            'once': !![],
            'onEnter': function () {
              _0x16d0d9['v'] = 0x0, _0x5b3f9a["gqFoO"](_0x2affb);
              var _0x14850c = {};
              _0x14850c['v'] = _0x1b8689, _0x14850c['duration'] = 2.2, _0x14850c["ease"] = 'power3.out', _0x14850c["onUpdate"] = _0x2affb, _0x14850c['onComplete'] = function () {
                _0x108694['textContent'] = _0x43bbe5;
              }, gsap['to'](_0x16d0d9, _0x14850c);
            }
          });
        }), function _0x276ee4() {
          var _0x5b4f77 = {};
          _0x5b4f77["AIxpK"] = _0xd1efb9['JdPqq'];
          var _0x155ed0 = _0x5b4f77;
          _0x5022c8["forEach"](function (_0x30d045) {
            var _0x405ff6 = _0x30d045['getAttribute'](_0x155ed0['AIxpK']);
            if (_0x405ff6) _0x30d045['textContent'] = _0x405ff6;
          });
        };
      }
      function _0x2e0ae7(_0x13ee1a) {
        var _0x475594 = _0x449e7b['MSwDl']["split"]('|'),
          _0x3fee83 = 0x0;
        while (!![]) {
          switch (_0x475594[_0x3fee83++]) {
            case '0':
              if (!_0x13ee1a) return;
              continue;
            case '1':
              var _0x47f18d = _0x13ee1a["querySelectorAll"](_0x449e7b['scWMf']);
              continue;
            case '2':
              if (_0x55ddcc && _0xcd0be3) {
                var _0x5bb8ff = {};
                _0x5bb8ff["scaleY"] = 0x0;
                var _0x108a94 = {};
                _0x108a94["scaleX"] = 0x0;
                var _0xb41a65 = {};
                _0xb41a65['scaleX'] = 0x1, _0xb41a65['scaleY'] = 0x1, _0xb41a65['ease'] = _0x449e7b["iNZiW"], _0xb41a65["scrollTrigger"] = {}, _0xb41a65["scrollTrigger"]['trigger'] = _0xcd0be3, _0xb41a65["scrollTrigger"]['start'] = _0x449e7b['vQFtv'], _0xb41a65["scrollTrigger"]["end"] = _0x449e7b['SAqXJ'], _0xb41a65["scrollTrigger"]['scrub'] = 0.5, gsap['fromTo'](_0x55ddcc, _0x1c9965 ? _0x5bb8ff : _0x108a94, _0xb41a65);
              }
              continue;
            case '3':
              var _0xcd0be3 = _0x13ee1a["querySelector"](_0x449e7b['ReqZK']);
              continue;
            case '4':
              var _0x55851c = {};
              _0x55851c['CCuUP'] = _0x449e7b["aKGKh"], _0x55851c['gVDez'] = _0x449e7b['dvNBq'], _0x55851c["RSUOt"] = "[data-how-pop]", _0x55851c['flwWz'] = 'top\x2082%', _0x55851c['CEDbD'] = "left center";
              var _0xdd4428 = _0x55851c;
              continue;
            case '5':
              var _0x1c9965 = window['matchMedia']("(max-width: 900px)")["matches"];
              continue;
            case '6':
              var _0x55ddcc = _0x13ee1a['querySelector']("[data-how-line]");
              continue;
            case '7':
              _0x47f18d["forEach"](function (_0x28ae98) {
                var _0x237870 = _0xdd4428["CCuUP"]["split"]('|'),
                  _0x5bc28a = 0x0;
                while (!![]) {
                  switch (_0x237870[_0x5bc28a++]) {
                    case '0':
                      if (_0x29c82b && _0x29c82b["getTotalLength"]) {
                        var _0x131823 = _0x29c82b['getTotalLength'](),
                          _0x19d419 = {};
                        _0x19d419['strokeDasharray'] = _0x131823, _0x19d419["strokeDashoffset"] = _0x131823;
                        var _0x549410 = {};
                        _0x549410['strokeDashoffset'] = 0x0, _0x549410['duration'] = 0.6, _0x549410["ease"] = 'power2.out', _0x139998['fromTo'](_0x29c82b, _0x19d419, _0x549410, 0.7);
                      }
                      continue;
                    case '1':
                      var _0x1883fe = {};
                      _0x1883fe['y'] = 0x28, _0x1883fe["opacity"] = 0x0;
                      var _0x47b0b8 = {};
                      _0x47b0b8['y'] = 0x0, _0x47b0b8['opacity'] = 0x1, _0x47b0b8["duration"] = 0.8, _0x47b0b8['ease'] = _0xdd4428['gVDez'], _0x139998["fromTo"](_0x28ae98, _0x1883fe, _0x47b0b8);
                      continue;
                    case '2':
                      var _0x442b09 = _0x28ae98["querySelectorAll"](_0xdd4428['RSUOt']);
                      continue;
                    case '3':
                      var _0xaa5a25 = {};
                      _0xaa5a25['trigger'] = _0x28ae98, _0xaa5a25["start"] = _0xdd4428['flwWz'], _0xaa5a25['once'] = !![];
                      var _0x312316 = {};
                      _0x312316['scrollTrigger'] = _0xaa5a25;
                      var _0x139998 = gsap["timeline"](_0x312316);
                      continue;
                    case '4':
                      var _0x359140 = {};
                      _0x359140['scale'] = 0.5, _0x359140["opacity"] = 0x0, _0x359140['duration'] = 0.55, _0x359140["stagger"] = 0.1, _0x359140["ease"] = 'back.out(2)';
                      if (_0x442b09["length"]) _0x139998['from'](_0x442b09, _0x359140, 0.35);
                      continue;
                    case '5':
                      var _0x29c82b = _0x28ae98['querySelector']("[data-how-check]");
                      continue;
                    case '6':
                      var _0x533e15 = _0x28ae98['querySelector']('[data-how-fill]');
                      continue;
                    case '7':
                      var _0x4af99f = {};
                      _0x4af99f["scaleX"] = 0x0, _0x4af99f["transformOrigin"] = _0xdd4428['CEDbD'], _0x4af99f["duration"] = 0.9, _0x4af99f["ease"] = _0xdd4428['gVDez'];
                      if (_0x533e15) _0x139998["from"](_0x533e15, _0x4af99f, 0.4);
                      continue;
                  }
                  break;
                }
              });
              continue;
          }
          break;
        }
      }
      function _0x14fe8f(_0x4f7825, _0x1e16da) {
        var _0x5669a5 = {};
        _0x5669a5['pGLnq'] = _0x3317cf['eyVwF'], _0x5669a5["oPiwZ"] = _0x3317cf['TSLpn'], _0x5669a5["FyvGp"] = function (_0x37c6de, _0x24b34f) {
          return _0x37c6de === _0x24b34f;
        }, _0x5669a5["QTzVb"] = 'all';
        var _0x1634ba = _0x5669a5;
        if (!_0x4f7825) return;
        var _0x343c22 = _0x4f7825['querySelector']('[data-billing-toggle]');
        if (!_0x343c22) return;
        var _0x374528 = Array['prototype']["slice"]["call"](_0x343c22["querySelectorAll"]("[data-billing-set]")),
          _0x5dfb89 = _0x343c22["querySelector"](_0x3317cf['kLCFD']),
          _0x3efe0b = _0x4f7825['querySelector'](_0x3317cf['vcUns']),
          _0x594a82 = _0x4f7825["querySelectorAll"](".pt-price-amount"),
          _0x137c2d = _0x4f7825['querySelectorAll'](".pt-price-note");
        function _0x3950fb(_0x4c660d) {
          var _0x5a4e9b = '1|2|0|4|3'["split"]('|'),
            _0x3dd47d = 0x0;
          while (!![]) {
            switch (_0x5a4e9b[_0x3dd47d++]) {
              case '0':
                if (!_0x23eb57 || !_0x5dfb89) return;
                continue;
              case '1':
                var _0x26431b = {};
                _0x26431b['nPvDX'] = 'aria-pressed', _0x26431b["APDxQ"] = "true";
                var _0x4a1833 = _0x26431b;
                continue;
              case '2':
                var _0x23eb57 = _0x374528['filter'](function (_0x42f55c) {
                  return _0x42f55c["getAttribute"](_0x4a1833["nPvDX"]) === _0x4a1833['APDxQ'];
                })[0x0];
                continue;
              case '3':
                var _0x2f5cfb = {};
                _0x2f5cfb['duration'] = 0.5, _0x2f5cfb['ease'] = 'power3.out';
                if (_0x3317cf["BxBdN"](_0x4c660d, !_0x1e16da)) gsap['set'](_0x5dfb89, _0x2e2a5a);else gsap['to'](_0x5dfb89, Object["assign"](_0x2f5cfb, _0x2e2a5a));
                continue;
              case '4':
                var _0x3ba4f2 = {};
                _0x3ba4f2['x'] = _0x23eb57['offsetLeft'], _0x3ba4f2['width'] = _0x23eb57["offsetWidth"];
                var _0x2e2a5a = _0x3ba4f2;
                continue;
            }
            break;
          }
        }
        function _0x195075(_0x1707dd, _0x70683d) {
          if (_0x4f7825["dataset"]["period"] === _0x1707dd && !_0x70683d) {
            _0x3317cf['tiMsC'](_0x3950fb, !![]);
            return;
          }
          _0x4f7825["dataset"]["period"] = _0x1707dd, _0x374528["forEach"](function (_0x5102c0) {
            _0x5102c0["setAttribute"](_0x1634ba["pGLnq"], _0x5102c0['dataset']['billingSet'] === _0x1707dd ? "true" : _0x1634ba["oPiwZ"]);
          }), _0x3317cf["BloeS"](_0x3950fb, !_0x70683d);
          if (_0x70683d) {
            if (_0x3efe0b) {
              var _0x20bf69 = _0x374528['filter'](function (_0x1b09fc) {
                return _0x1b09fc['dataset']['billingSet'] === _0x1707dd;
              })[0x0];
              _0x3efe0b["textContent"] = _0x3317cf["kbLOg"](_0x20bf69 ? _0x20bf69['firstChild']["textContent"]['trim']() : _0x1707dd, '\x20prices\x20shown');
            }
            if (_0x1e16da) {
              var _0x105e6f = {};
              _0x105e6f['yPercent'] = 0x37, _0x105e6f['opacity'] = 0x0;
              var _0x3828f7 = {};
              _0x3828f7["yPercent"] = 0x0, _0x3828f7['opacity'] = 0x1, _0x3828f7['duration'] = 0.5, _0x3828f7["stagger"] = 0.06, _0x3828f7["ease"] = "back.out(1.7)", _0x3828f7['overwrite'] = _0x3317cf["WoBZZ"], gsap['fromTo'](_0x594a82, _0x105e6f, _0x3828f7);
              var _0x1cdb90 = {};
              _0x1cdb90["opacity"] = 0x0;
              var _0x689a3d = {};
              _0x689a3d['opacity'] = 0x1, _0x689a3d["duration"] = 0.4, _0x689a3d['overwrite'] = _0x3317cf['WoBZZ'], gsap['fromTo'](_0x137c2d, _0x1cdb90, _0x689a3d);
            }
          }
        }
        _0x374528["forEach"](function (_0xbe043e) {
          _0x427a0c(_0xbe043e, "click", function () {
            _0x195075(_0xbe043e["dataset"]['billingSet'], !![]);
          });
        });
        var _0x10a112 = _0x4f7825['dataset']['period'] || "monthly";
        _0x374528['forEach'](function (_0x38010a) {
          _0x38010a['setAttribute'](_0x1634ba["pGLnq"], _0x1634ba["FyvGp"](_0x38010a['dataset']['billingSet'], _0x10a112) ? "true" : 'false');
        }), _0x3950fb(!![]);
        var _0x30bae7 = new ResizeObserver(function () {
          _0x3950fb(!![]);
        });
        _0x30bae7["observe"](_0x343c22);
        if (document['fonts'] && document["fonts"]["ready"]) document["fonts"]["ready"]["then"](function () {
          _0x3950fb(!![]);
        });
        return _0x1fe5ee["push"](function () {
          _0x30bae7["disconnect"]();
        }), function _0x483609() {
          _0x4f7825['dataset']['period'] = _0x10a112;
          var _0x20cbad = {};
          _0x20cbad["clearProps"] = _0x1634ba['QTzVb'];
          if (_0x5dfb89) gsap['set'](_0x5dfb89, _0x20cbad);
        };
      }
      function _0x3e985a(_0x2a2bea, _0x3be88c) {
        var _0x288ea7 = {
          'CFtGr': function (_0x14be59, _0x25a805, _0x2da290) {
            return _0x449e7b["Nssoy"](_0x14be59, _0x25a805, _0x2da290);
          },
          'IBcnz': function (_0x133ede, _0x5ad794) {
            return _0x449e7b['IBYOQ'](_0x133ede, _0x5ad794);
          },
          'gkKfz': _0x449e7b['KfxcC'],
          'PeJNK': _0x449e7b["rGvgj"],
          'jdMXJ': function (_0x906641, _0xd73df7, _0x3418de) {
            return _0x906641(_0xd73df7, _0x3418de);
          },
          'yegRE': function (_0x58a731, _0x7933db) {
            return _0x58a731 || _0x7933db;
          },
          'pKTQv': function (_0x1d010d, _0x2d8d6b) {
            return _0x1d010d + _0x2d8d6b;
          },
          'cISMK': function (_0xe4db41, _0x8922a7) {
            return _0x449e7b['cWoEz'](_0xe4db41, _0x8922a7);
          },
          'dTYsr': 'aria-labelledby',
          'KgTNf': _0x449e7b['JllLq'],
          'xckMT': function (_0x1b018a, _0x5171ad, _0x129225, _0x3874c7) {
            return _0x1b018a(_0x5171ad, _0x129225, _0x3874c7);
          },
          'mEXYo': _0x449e7b['lCPwB'],
          'ShnZC': _0x449e7b["AEVQR"],
          'bpMTu': "power3.inOut",
          'TbGiP': _0x449e7b['ySqXm']
        };
        if (!_0x2a2bea) return;
        var _0x362795 = Array["prototype"]["slice"]['call'](_0x2a2bea["querySelectorAll"](".pt-faq-item"));
        if (!_0x362795["length"]) return;
        _0x362795['forEach'](function (_0x4e91f8, _0x3b69d2) {
          var _0x352b6f = _0x4e91f8["querySelector"]("[data-faq-q]"),
            _0x5b5425 = _0x4e91f8['querySelector']('[data-faq-a]');
          if (_0x288ea7["yegRE"](!_0x352b6f, !_0x5b5425)) return;
          _0x352b6f['id'] = _0x352b6f['id'] || _0x288ea7['pKTQv']("faq-q-", _0x3b69d2), _0x5b5425['id'] = _0x5b5425['id'] || _0x288ea7["cISMK"]("faq-a-", _0x3b69d2), _0x352b6f["setAttribute"]('aria-controls', _0x5b5425['id']), _0x5b5425["setAttribute"]("role", "region"), _0x5b5425['setAttribute'](_0x288ea7["dTYsr"], _0x352b6f['id']);
          var _0x244066 = _0x4e91f8['hasAttribute'](_0x288ea7['KgTNf']);
          _0x352b6f['setAttribute']('aria-expanded', _0x244066 ? _0x288ea7["PeJNK"] : "false"), _0x4e91f8['classList']['toggle']("pt-is-open", _0x244066), _0x288ea7["xckMT"](_0x427a0c, _0x352b6f, _0x288ea7["mEXYo"], function () {
            var _0x14153c = {
                'zKBhf': function (_0x2b56df, _0x4e31dd, _0x4f0180) {
                  return _0x288ea7['CFtGr'](_0x2b56df, _0x4e31dd, _0x4f0180);
                }
              },
              _0x31ab5b = _0x288ea7["IBcnz"](_0x352b6f['getAttribute'](_0x288ea7["gkKfz"]), _0x288ea7['PeJNK']);
            _0x362795["forEach"](function (_0x2f2c86) {
              if (_0x2f2c86 !== _0x4e91f8) _0x14153c['zKBhf'](_0x4752c5, _0x2f2c86, ![]);
            }), _0x288ea7['jdMXJ'](_0x4752c5, _0x4e91f8, _0x31ab5b);
          });
        });
        function _0x4752c5(_0x19b119, _0x3f4aad) {
          var _0x53e822 = '9|5|4|1|0|6|2|7|8|3'["split"]('|'),
            _0x5885b4 = 0x0;
          while (!![]) {
            switch (_0x53e822[_0x5885b4++]) {
              case '0':
                var _0x45822c = _0x28193e['getAttribute'](_0x288ea7['gkKfz']) === _0x288ea7["PeJNK"];
                continue;
              case '1':
                if (!_0x28193e || !_0x5a64f3) return;
                continue;
              case '2':
                _0x28193e["setAttribute"]("aria-expanded", _0x3f4aad ? 'true' : "false");
                continue;
              case '3':
                if (_0x3f4aad) {
                  _0x19b119["classList"]['add']("pt-is-open");
                  var _0xdc0515 = {};
                  _0xdc0515["height"] = 0x0, gsap["fromTo"](_0x5a64f3, _0xdc0515, {
                    'height': 'auto',
                    'duration': 0.5,
                    'ease': 'power3.out',
                    'onComplete': function () {
                      var _0x4bac9f = {};
                      _0x4bac9f['clearProps'] = _0x110019["PwYRo"], gsap['set'](_0x5a64f3, _0x4bac9f);
                    }
                  });
                } else gsap['to'](_0x5a64f3, {
                  'height': 0x0,
                  'duration': 0.4,
                  'ease': _0x288ea7["bpMTu"],
                  'onComplete': function () {
                    _0x19b119['classList']['remove'](_0x288ea7["ShnZC"]);
                    var _0x2deac1 = {};
                    _0x2deac1["clearProps"] = 'height', gsap["set"](_0x5a64f3, _0x2deac1);
                  }
                });
                continue;
              case '4':
                var _0x5a64f3 = _0x19b119["querySelector"]("[data-faq-a]");
                continue;
              case '5':
                var _0x28193e = _0x19b119["querySelector"]("[data-faq-q]");
                continue;
              case '6':
                if (_0x45822c === _0x3f4aad) return;
                continue;
              case '7':
                gsap['killTweensOf'](_0x5a64f3);
                continue;
              case '8':
                if (!_0x3be88c) {
                  _0x19b119['classList']['toggle'](_0x288ea7["ShnZC"], _0x3f4aad);
                  var _0xbf26ba = {};
                  _0xbf26ba['clearProps'] = _0x288ea7["TbGiP"], gsap["set"](_0x5a64f3, _0xbf26ba);
                  return;
                }
                continue;
              case '9':
                var _0x357657 = {};
                _0x357657['PwYRo'] = _0x288ea7["TbGiP"];
                var _0x110019 = _0x357657;
                continue;
            }
            break;
          }
        }
        return function _0x25fd10() {
          _0x362795['forEach'](function (_0x5cb837) {
            var _0x192462 = _0x5cb837["querySelector"]('[data-faq-a]'),
              _0x3c1286 = {};
            _0x3c1286['clearProps'] = _0x288ea7['TbGiP'];
            if (_0x192462) gsap["set"](_0x192462, _0x3c1286);
          });
        };
      }
      var _0x2c00dd = {};
      _0x2c00dd["isFine"] = _0x449e7b["yByDG"], _0x2c00dd['isMotion'] = _0x449e7b['MXlXB'], _0x2c00dd['isReduced'] = "(prefers-reduced-motion: reduce)", _0x4e1fb7["add"](_0x2c00dd, function (_0x180561) {
        var _0x4a0f81 = {};
        _0x4a0f81['LJVhg'] = 'function', _0x4a0f81["ferYK"] = _0x3317cf["eaInz"];
        var _0x5f3b11 = _0x4a0f81,
          _0x37e8b4 = _0x180561["conditions"]['isMotion'];
        _0x4161da = _0x180561, _0x375825 = _0x37e8b4;
        var _0x10945a = [];
        function _0x4e5772(_0x18f1df) {
          if (typeof _0x18f1df === _0x5f3b11['LJVhg']) _0x10945a["push"](_0x18f1df);
        }
        var _0x25b00a = _0x37e8b4 ? initLenis() : null,
          _0xf7ce28 = null,
          _0x30389c = null;
        _0x37e8b4 && typeof THREE !== _0x3317cf["SrhgC"] && hasWebGL() && (_0xf7ce28 = _0x3c7d6b());
        _0xf7ce28 ? document['documentElement']['classList']["add"]("pt-gl") : document['documentElement']["classList"]['remove']("pt-gl");
        _0x3317cf['jYMQF'](_0x55760b);
        if (_0x37e8b4) _0x3317cf['BloeS'](_0x4e5772, _0x3317cf['fMdiY'](_0x47be07, document["querySelector"](_0x3317cf["IeChX"]), _0xf7ce28)), _0x4e5772(_0x3317cf['HNQkO'](_0x47edf8, document['querySelector'](_0x3317cf["pGEYi"]), _0xf7ce28)), _0x3317cf['jYMQF'](_0xff10b5), _0x3317cf['DlYeD'](_0x2e0ae7, document["querySelector"]("[data-section=\"how\"]")), _0x3317cf["qzYyq"](_0x4e5772, _0x3317cf['rHxDC'](_0x51e8f4, document['querySelector']('[data-section=\x22proof\x22]')));else {
          var _0x37ade1 = {};
          _0x37ade1["opacity"] = 0x1, _0x37ade1['y'] = 0x0, _0x37ade1['clearProps'] = "transform", gsap["set"]('[data-hero-fade],\x20[data-reveal],\x20[data-reveal-group]\x20>\x20*', _0x37ade1);
          var _0x42d4f9 = {};
          _0x42d4f9["visibility"] = "visible", _0x42d4f9['clearProps'] = "transform", gsap["set"]("[data-hero] .pt-chip", _0x42d4f9);
        }
        _0x4e5772(_0x14fe8f(document["querySelector"](_0x3317cf["FdPxL"]), _0x37e8b4)), _0x3317cf['RLyTK'](_0x4e5772, _0x3e985a(document["querySelector"](_0x3317cf['uiZAR']), _0x37e8b4));
        if (_0xf7ce28) {
          _0x30389c = function () {
            _0xf7ce28["measure"]();
          }, ScrollTrigger['addEventListener']('refresh', _0x30389c);
          if (document["fonts"] && document["fonts"]['ready']) document['fonts']['ready']['then'](function () {
            _0xf7ce28 && ScrollTrigger["refresh"]();
          });
          _0xf7ce28['measure']();
        }
        return function _0x3b804d() {
          _0x1fe5ee['forEach'](function (_0x397aa0) {
            _0x397aa0();
          }), _0x1fe5ee['length'] = 0x0, _0x10945a['forEach'](function (_0xcd1c36) {
            _0xcd1c36();
          });
          if (_0x30389c) ScrollTrigger['removeEventListener'](_0x5f3b11['ferYK'], _0x30389c);
          if (_0xf7ce28) _0xf7ce28["destroy"]();
          document["documentElement"]["classList"]["remove"]("pt-gl");
          if (_0x25b00a) _0x25b00a();
        };
      });
      var _0x1548c7 = function () {
        _0x250523['revert']();
      };
      return window["addEventListener"](_0x449e7b["lUbxV"], _0x1548c7), function _0x1ba45f() {
        window['removeEventListener'](_0x3317cf['nIWqS'], _0x1548c7);
        if (_0x3317cf['TWgDF'](window['gsapContext'], _0x250523)) {
          document['documentElement']["classList"]["remove"]("pt-has-js");
          if (_0x1705ac === undefined) delete window["gsapContext"];else window['gsapContext'] = _0x1705ac;
        }
      };
    });
  window['gsapContext'] = _0x379f62;
});

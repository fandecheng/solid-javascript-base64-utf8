/* vim: set sts=4 ts=4 sw=4 et nojs fo-=ro fo+=ro: */

/*
Copyright (c) 2013 Decheng Fan fandecheng_at_gmail.com

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/

var FDCCommon = {
  TextUtil : {
    _HexMap : "0123456789abcdef",
    _HexRMap : [ -1, -1, -1, -1, -1, -1, -1, -1, /*  0~  7 */
                 -1, -1, -1, -1, -1, -1, -1, -1, /*  8~ 15 */
                 -1, -1, -1, -1, -1, -1, -1, -1, /* 16~ 23 */
                 -1, -1, -1, -1, -1, -1, -1, -1, /* 24~ 31 */
                 -1, -1, -1, -1, -1, -1, -1, -1, /* 32~ 39 */
                 -1, -1, -1, -1, -1, -1, -1, -1, /* 40~ 47 */
                  0,  1,  2,  3,  4,  5,  6,  7, /* 48~ 55 */
                  8,  9, -1, -1, -1, -1, -1, -1, /* 56~ 63 */
                 -1, 10, 11, 12, 13, 14, 15, -1, /* 64~ 71 */
                 -1, -1, -1, -1, -1, -1, -1, -1, /* 72~ 79 */
                 -1, -1, -1, -1, -1, -1, -1, -1, /* 80~ 87 */
                 -1, -1, -1, -1, -1, -1, -1, -1, /* 88~ 95 */
                 -1, 10, 11, 12, 13, 14, 15 ],   /* 96~101 */

    /**
     *  Utf16ToUtf8:
     *      Converts a UTF-16 string (which is a String-type object in
     *      Javascript) into a string of hexadecimal digits representing UTF-8
     *      bytes.
     *
     *  Parameters:
     *      str - the UTF-16 string (Javascript string)
     *
     *  Return value:
     *      An array consisting of:
     *      [0] - The hexadecimal string representation of UTF-8 bytes
     *      [1] - (true or false) Whether there is a blocking error:
     *            inconsistency in the UTF-16 string
     *
     *  Remarks:
     *      Upon an error, you should consider reporting or logging it and
     *      skipping later code that will depend on the possibly inconsistent
     *      data.
     */
    Utf16ToUtf8 : function(str) {
        var i;
        var utfret; /* UTF return value */
        var ch;
        var hex_arr;
        var bar;
        var f_breakout;
        var result;

        result = [null, false];
        f_breakout = false;
        for (bar = 0; bar < 1; ++bar) {
            hex_arr = [];
            /* so that we can break instead of return */
            for (i = 0; i < str.length; i = utfret[0]) {
                utfret = FDCCommon.TextUtil.Utf16Inc(str, i);
                if (utfret[1]) {
                    result[1] = true;
                    f_breakout = true;
                    break;
                }
                /* Refer to wikipedia UTF-8 */
                /* NOTE: the reason for using ByteToHex is that not all
                 * browsers (esp. Internet Explorer 9) support Uint8Array; in
                 * future, Uint8Array should be used because it has the best
                 * space-efficiency; a hexadecimal string is 4 times as large
                 * and an built-in Array of bytes can be 40 times as large */
                ch = utfret[2];
                if (ch < 0x7F) {
                    hex_arr.push(FDCCommon.TextUtil.ByteToHex(ch));
                } else if (ch < 0x7FF) {
                    hex_arr.push(FDCCommon.TextUtil.ByteToHex(0xC0 + (ch >> 6)));
                    hex_arr.push(FDCCommon.TextUtil.ByteToHex(0x80 + (ch & 0x3F)));
                } else if (ch < 0xFFFF) {
                    hex_arr.push(FDCCommon.TextUtil.ByteToHex(0xE0 + (ch >> 12)));
                    hex_arr.push(FDCCommon.TextUtil.ByteToHex(0x80 + ((ch >> 6) & 0x3F)));
                    hex_arr.push(FDCCommon.TextUtil.ByteToHex(0x80 + (ch & 0x3F)));
                } else if (ch < 0x1FFFFF) {
                    hex_arr.push(FDCCommon.TextUtil.ByteToHex(0xF0 + (ch >> 18)));
                    hex_arr.push(FDCCommon.TextUtil.ByteToHex(0x80 + ((ch >> 12) & 0x3F)));
                    hex_arr.push(FDCCommon.TextUtil.ByteToHex(0x80 + ((ch >> 6) & 0x3F)));
                    hex_arr.push(FDCCommon.TextUtil.ByteToHex(0x80 + (ch & 0x3F)));
                } else if (ch < 0x3FFFFFF) {
                    hex_arr.push(FDCCommon.TextUtil.ByteToHex(0xF8 + (ch >> 24)));
                    hex_arr.push(FDCCommon.TextUtil.ByteToHex(0x80 + ((ch >> 18) & 0x3F)));
                    hex_arr.push(FDCCommon.TextUtil.ByteToHex(0x80 + ((ch >> 12) & 0x3F)));
                    hex_arr.push(FDCCommon.TextUtil.ByteToHex(0x80 + ((ch >> 6) & 0x3F)));
                    hex_arr.push(FDCCommon.TextUtil.ByteToHex(0x80 + (ch & 0x3F)));
                } else if (ch < 0x7FFFFFFF) {
                    hex_arr.push(FDCCommon.TextUtil.ByteToHex(0xFC + (ch >> 30)));
                    hex_arr.push(FDCCommon.TextUtil.ByteToHex(0x80 + ((ch >> 24) & 0x3F)));
                    hex_arr.push(FDCCommon.TextUtil.ByteToHex(0x80 + ((ch >> 18) & 0x3F)));
                    hex_arr.push(FDCCommon.TextUtil.ByteToHex(0x80 + ((ch >> 12) & 0x3F)));
                    hex_arr.push(FDCCommon.TextUtil.ByteToHex(0x80 + ((ch >> 6) & 0x3F)));
                    hex_arr.push(FDCCommon.TextUtil.ByteToHex(0x80 + (ch & 0x3F)));
                } else {
                    result[1] = true;
                    f_breakout = true;
                    break;
                }
            }
            if (f_breakout) {
                break;
            }
            result[0] = hex_arr.join("");
        }
        return result;
    }
    ,

    /**
     *  Utf16Inc:
     *      UTF-16 increment. Increments an index to a UTF-16 string to point
     *      to the next character, and returns the code point of the processed
     *      character.
     *
     *  Parameters:
     *      str - the string to read
     *      idx - the current index, of which the next index is to be returned
     *
     *  Return value:
     *      An array with members:
     *      [0] - The next index if not at the end of the string. Otherwise,
     *            str.length or higher.
     *      [1] - (true or false) Whether an incomplete surrogate pair is
     *            encountered (which means the string is not complete or
     *            consistent)
     *      [2] - The Unicode code point of the character processed
     *
     *      Upon an error, you should consider reporting or logging it and
     *      skipping later code that will depend on the possibly inconsistent
     *      data.
     *
     *  Remarks:
     *      Because the resulting string representation of a hexadecimal or
     *      Base-64 string (as a result from Utf16ToUtf8()) in the RAM is quite
     *      bloated (2~4 times of actually needed), you may want to split a
     *      string when passing it. In order to split the string at character
     *      boundary (rather than accidentally at surrogate pair boundary), you
     *      can also use Utf16Inc().
     */
    Utf16Inc : function(str, idx) {
        var ch;
        var ch2;
        var bar;
        var result;

        result = [0, false, 0];
        for (bar = 0; bar < 1; ++bar) { /* so that on error we can break instead of return */
            if (idx >= str.length) {
                result[0] = idx;
                break;
            }
            ch = str.charCodeAt(idx);
            if (0xD800 <= ch && ch <= 0xDBFF) {
                /* surrogate pair first character */
                if (idx + 1 < str.length) {
                    ch2 = str.charCodeAt(idx + 1);
                    if (0xDC00 <= ch2 && ch2 <= 0xDFFF) {
                        result[0] = idx + 2;
                        result[2] = (ch - 0xD800) * 0x400 + (ch2 - 0xDC00) + 0x10000;
                    } else {
                        result[1] = true;
                        break;
                    }
                } else {
                    result[1] = true;
                    break;
                }
            } else if (ch >= 0xDC00 && ch <= 0xDFFF) {
                result[1] = true;
                break;
            } else {
                result[0] = idx + 1;
                result[2] = ch;
            }
        }
        return result;
    }
    ,

    /**
     *  Utf8ToUtf16:
     *      Converts a hexadecimal digit string representing a UTF-8 string
     *      into a representing UTF-16 string (which is a Javascript String
     *      object).
     *
     *  Parameters:
     *      str - the UTF-16 string (Javascript string)
     *
     *  Return value:
     *      An array consisting of:
     *      [0] - The UTF-16 string
     *      [1] - (true or false) Whether any error occurred; if only this is
     *            true, it means the input string is an invalid hexadecimal
     *            string
     *      [2] - (true or false) Whether there is a blocking error:
     *            inconsistency in the UTF-8 string
     *
     *  Remarks:
     *      Upon an error, you should consider reporting or logging it and
     *      skipping later code that will depend on the possibly inconsistent
     *      data.
     */
    Utf8ToUtf16 : function(hex_str) {
        var i;
        var utfret;
        var utf16_arr;
        var codepoint;
        var codepoin2;
        var bar;
        var str_len;
        var f_breakout = false;
        var result;
        var hex2byte = FDCCommon.TextUtil.HexToByte;

        result = [null, false, false];
        for (bar = 0; bar < 1; ++bar) {
            /* check whether the string is a valid hexadecimal string */
            if (hex_str.length % 2 != 0) {
                result[1] = true;
                break;
            }
            for (i = 0, str_len = hex_str.length; i < str_len; i += 2) {
                if (hex2byte(hex_str.substr(i, 2)) < 0) {
                    result[1] = true;
                    f_breakout = true;
                    break;
                }
            }
            if (f_breakout) {
                break;
            }
            utf16_arr = [];
            for (i = 0, str_len = hex_str.length; i < str_len; ) {
                utfret = FDCCommon.TextUtil.Utf8Inc(hex_str, i);
                if (utfret[1]) { /* error occurred */
                    result[1] = true;
                    result[2] = true; /* also a UTF-8 error */
                    f_breakout = true;
                    break;
                }
                i = utfret[0]; /* point to the next character */
                codepoint = utfret[2];
                if (codepoint <= 0xFFFF) {
                    /* a BMP character or half of the surrogate pair */
                    utf16_arr.push(String.fromCharCode(codepoint));
                } else {
                    /* make a surrogate pair */
                    codepoin2 = codepoint - 0x10000;
                    utf16_arr.push(String.fromCharCode(((codepoin2 >> 10) & 0x3FF) + 0xD800));
                    utf16_arr.push(String.fromCharCode((codepoin2 & 0x3FF) + 0xDC00));
                }
            }
            if (f_breakout) {
                break;
            }
            utfret = null;
            result[0] = utf16_arr.join("");
        }
        return result;
    }
    ,

    /**
     *  Utf8Inc:
     *      UTF-8 increment. Increments an index to a hexadecimal string
     *      representing a UTF-8 string, to make the index point to the next
     *      character, and returns the code point of the processed character.
     *
     *  Parameters:
     *      hex_str - the string to read; it must be a valid hexadecimal string
     *          representing bytes
     *      idx - the current index in the unit of hexadecimal digit, of which
     *          the next index is to be returned
     *
     *  Return value:
     *      An array with members:
     *      [0] - The next hexadecimal digit index if not at the end of the
     *            string. Otherwise, hex_str.length or higher.
     *      [1] - (true or false) Whether an incomplete UTF-8 character is
     *            encountered (which means the string is not complete or
     *            consistent)
     *      [2] - The Unicode code point of the character processed
     *
     *      Upon an error, you should consider reporting or logging it and
     *      skipping later code that will depend on the possibly inconsistent
     *      data.
     *
     *      If hex_str is not a valid hexadecimal string representing bytes,
     *      the behavior is undefined.
     */
    Utf8Inc : function(hex_str, idx) {
        var str_len;
        var byte_cnt; /* byte count */
        var i;
        var byte0;
        var bytes;
        var bytes_o;
        var right_edge;
        var left_edge;
        var right_byte;
        var left_byte;
        var bits_off; /* bit offset */
        var bar;
        var result;
        var f_breakout = false;
        var hex2byte = FDCCommon.TextUtil.HexToByte;

        result = [0, false, 0];
        for (bar = 0; bar < 1; ++bar) { /* so that on error we can break instead of return */
            str_len = hex_str.length;
            if (idx >= str_len) {
                result[0] = idx;
                break;
            }
            byte0 = hex2byte(hex_str.substr(idx, 2));
            if (byte0 < 0x80) {
                result[0] = idx + 2;
                result[2] = byte0;
            } else {
                /* for the format, see UTF-8 on wikipedia */
                /* Determine the byte count { */
                byte_cnt = 0;
                if (byte0 < 0xC0) {
                    /* invalid--looks like a trailing byte */
                    result[1] = true;
                    break;
                } else if (byte0 < 0xE0) {
                    byte_cnt = 2;
                } else if (byte0 < 0xF0) {
                    byte_cnt = 3;
                } else if (byte0 < 0xF8) {
                    byte_cnt = 4;
                } else if (byte0 < 0xFC) {
                    byte_cnt = 5;
                } else if (byte0 < 0xFE) {
                    byte_cnt = 6;
                } else {
                    /* invalid */
                    result[1] = true;
                    break;
                }
                /* } Determine the byte count */
                if (idx + byte_cnt * 2 - 1 >= str_len) {
                    /* incomplete character */
                    result[1] = true;
                    break;
                }
                bytes = [0, 0, 0, 0, 0, 0];
                /* below "7 - byte_cnt": when byte_cnt is 2, then we get 5 bit
                 * of 1s, which is 0b00011111, and so on, for the code point
                 * bits in the first byte */
                bytes[0] = byte0 & ((1 << (7 - byte_cnt)) - 1);
                for (i = 1; i < byte_cnt; ++i) {
                    bytes[i] = hex2byte(hex_str.substr(idx + i * 2, 2));
                    if ((bytes[i] & 0xC0) != 0x80) {
                        /* invalid trailing character */
                        result[1] = true;
                        f_breakout = true;
                        break;
                    }
                    bytes[i] &= 0x3F;
                }
                if (f_breakout) {
                    break;
                }
                bytes_o = [0, 0, 0, 0]; /* output code point bytes */
                for (i = byte_cnt - 1; i >= 0; --i) {
                    /* let's copy the 6-bit bytes into 8-bit bytes (at most 3
                     * bytes for real Unicode, but we fill 4 bytes) */
                    /* like: (____6666 66555555) 44444433 33332222 22111111 */
                    /* note that the first byte has no more than 5 code point
                     * bits, but we also treat it as a 6-bit to simplify the
                     * logic */
                    right_edge = 32 - (byte_cnt - 1 - i) * 6;
                    left_edge = right_edge - 6;
                    if (left_edge < 0) {
                        /* invalid Unicode code point (too large) */
                        result[1] = true;
                        f_breakout = true;
                        break;
                    }
                    /* right_byte/ left_byte are two byte positions */
                    right_byte = Math.floor((right_edge - 1) / 8);
                    left_byte = Math.floor(left_edge / 8);
                    bits_off = (right_byte + 1) * 8 - right_edge;
                    bytes_o[right_byte] |= (bytes[i] << bits_off) & 0xFF;
                    if (left_byte != right_byte) { /* if the 6 bit crosses a byte boundary */
                        bits_off = right_edge - right_byte * 8;
                        bytes_o[left_byte] |= (bytes[i] >> bits_off) & 0xFF;
                    }
                }
                if (f_breakout) {
                    break;
                }
                result[0] = idx + byte_cnt * 2;
                result[2] = bytes_o[0] << 24 | bytes_o[1] << 16
                          | bytes_o[2] <<  8 | bytes_o[3];
            }
        }
        return result;
    }
    ,

    /**
     *  ByteToHex:
     *      Converts a byte (an Number object between 0 and 255) to a two-digit
     *      hexadecimal string. The return value is always 2-digit even if the
     *      first digit is 0.
     */
    ByteToHex : function(byte) {
        /* NOTE: substr(start, length); instead of substring(start, end); */
        return FDCCommon.TextUtil._HexMap.substr(byte / 16, 1)
             + FDCCommon.TextUtil._HexMap.substr(byte % 16, 1);
    }
    ,

    /**
     *  HexToByte:
     *      Converts two hexadecimal digits to an integer between 0 and 255.
     */
    HexToByte : function(hex_str) {
        var hex_hi;
        var hex_lo;
        var map = FDCCommon.TextUtil._HexRMap;
        var map_len = map.length;

        if (hex_str.length < 2) {
            return -1;
        }
        hex_hi = hex_str.charCodeAt(0);
        hex_lo = hex_str.charCodeAt(1);
        /* NOTE: two invalid data exit points: hex > map_len, or map result is
         * -1 */
        if (hex_hi < map_len) {
            hex_hi = map[hex_hi];
            if (hex_hi < 0) {
                return -1;
            }
        } else {
            return -1;
        }
        if (hex_lo < map_len) {
            hex_lo = map[hex_lo];
            if (hex_lo < 0) {
                return -1;
            }
        } else {
            return -1;
        }
        return (hex_hi << 4) + hex_lo;
    }
  }
  ,

  Base64 : {
    _CodeMap : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    _CodeRMap :
     [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
      -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
      -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
      52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, 64, -1, -1,
      -1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14,
      15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
      -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
      41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1,
      -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
      -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
      -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
      -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
      -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
      -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
      -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
      -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],

    /**
     *  Encode:
     *      Encodes a hexadecimal string into a base64 string. The input string
     *      must be a valid hexadecimal string--this function doesn't check for
     *      the validity.
     */
    Encode : function(hex_str) {
        var result = [];
        var block;
        var i;
        var str_len;
        var padding;
        var byte0;
        var byte1;
        var byte2;
        var hex2byte = FDCCommon.TextUtil.HexToByte;
        var codemap = FDCCommon.Base64._CodeMap;

        /* base64 encoding turns 3 bytes into 4 characters (6 bits per
         * character), so we deal with 3 bytes a time */
        for (i = 0, str_len = hex_str.length, padding = 0; i < str_len;
             i += 2 * 3)
        {
            block = [];
            /* wrap at 72 characters (54 bytes, 108 hex digits) */
            if (i % 108 == 0 && i != 0) {
                block.push("\n"); /* line-feed */
            }
            byte0 = 0;
            byte1 = 0;
            byte2 = 0;
            if (i + 2 - 1 < str_len) {
                /* first byte available */
                byte0 = hex2byte(hex_str.substr(i, 2));
             if (i + 4 - 1 < str_len) { /* intentionally unindented */
                 byte1 = hex2byte(hex_str.substr(i + 2, 2));
              if (i + 6 - 1 < str_len) {
                  byte2 = hex2byte(hex_str.substr(i + 4, 2));
              } else {
                  padding = 1;
              }
             } else {
                 padding = 2;
             }
            } /* else should never happen if hex_str is correct */
            block.push(codemap.substr(byte0 >> 2, 1));
            block.push(codemap.substr(((byte0 & 0x03) << 4) | (byte1 >> 4), 1));
            block.push(codemap.substr(((byte1 & 0x0F) << 2) | (byte2 >> 6), 1));
            block.push(codemap.substr(byte2 & 0x3F, 1));
            if (padding >= 1) { /* only happens at the end */
                /* set base64 padding character */
                block[3] = "=";
                if (padding == 2) {
                    block[2] = "=";
                }
            }
            result.push(block.join(""));
        }
        return result.join("");
    }
    ,

    /**
     *  EncodeString:
     *      Encodes a string to its UTF-8 base64.
     *
     *  Parameters:
     *      str - the javascript (UTF-16) string to encode
     *
     *  Return value:
     *      An array with members:
     *      [0] - The encoded string
     *      [1] - (true or false) Whether a blocking error occurred during the
     *            encoding (such as an incomplete surrogate pair)
     */
    EncodeString : function (str) {
        var result = [];
        var utf8ret;

        result = ["", false];
        utf8ret = FDCCommon.TextUtil.Utf16ToUtf8(str);
        if (utf8ret[1]) { /* error occurred */
            result[1] = true;
            return result;
        }
        result[0] = FDCCommon.Base64.Encode(utf8ret[0]);
        return result;
    }
    ,

    /**
     *  Decode:
     *      Converts a base64 string to a hexadecimal string.
     */
    Decode : function (base64_str)
    {
        var PadCode = 64; /* the pad character "=" */
        var str_len;
        var i;
        var j;
        var ch;
        var code;
        var buffer;
        var buffer2;
        var bytecnt;
        var result;
        var codermap = FDCCommon.Base64._CodeRMap; /* reverse map */

        result = [];
        buffer = [0, 0, 0, 0]; /* four 0~63 numbers */
        buffer2 = [0, 0, 0]; /* three bytes */
        j = 0;
        for (i = 0, str_len = base64_str.length; i < str_len; ++i) {
            ch = base64_str.charCodeAt(i); /* always positive */
            if (ch < 256) { /* should always be the case */
                code = codermap[ch];
                if (code >= 0) {
                    buffer[j] = code;
                    ++j;
                    if (j == 4) {
                        /* commit */
                        bytecnt = -1;
                        /* reuse `j'; we'll reset it later */
                        for (j = 0; j < 4; ++j) {
                            /* We assume pad characters only appear at the
                             * end of `base64_str' */
                            if (buffer[j] == PadCode) {
                                if (bytecnt < 0) {
                                    bytecnt = Math.floor(j * 3 / 4);
                                }
                                buffer[j] = 0; /* clear the pad character */
                            }
                        }
                        if (bytecnt < 0) {
                            bytecnt = 3;
                        }
                        buffer2[0]  = (buffer[0] << 2) & 0xFF;
                        buffer2[0] |=  buffer[1] >> 4;
                        buffer2[1]  = (buffer[1] << 4) & 0xFF;
                        buffer2[1] |=  buffer[2] >> 2;
                        buffer2[2]  = (buffer[2] << 6) & 0xFF;
                        buffer2[2] |=  buffer[3];
                        for (j = 0; j < bytecnt; ++j) {
                            result.push(FDCCommon.TextUtil.ByteToHex(buffer2[j]));
                        }
                        for (j = 0; j < 4; ++j) {
                            buffer[j] = 0; /* clear it */
                        }
                        j = 0;
                    }
                } /* else ignore the character */
            }
        }
        return result.join("");
    }
    ,

    /**
     *  DecodeString:
     *      Decodes a UTF-8 base64 string to a Javascript string.
     *
     *  Parameters:
     *      str - the base64 string to decode
     *
     *  Return value:
     *      An array with members:
     *      [0] - The decoded string
     *      [1] - (true or false) Whether a blocking error occurred during the
     *            decoding (such as an incomplete UTF-8 character)
     */
    DecodeString : function (base64_str) {
        var result = [];
        var utfret;

        result = ["", false];
        utfret = FDCCommon.TextUtil.Utf8ToUtf16(FDCCommon.Base64.Decode(base64_str));
        if (utfret[1]) { /* error occurred */
            result[1] = true;
            return result;
        }
        result[0] = utfret[0];
        return result;
    }

  }
};

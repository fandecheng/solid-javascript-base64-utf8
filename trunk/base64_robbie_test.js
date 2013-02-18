TextUtil = FDCCommon.TextUtil;
Base64 = FDCCommon.Base64;

function RobbieTest_Utf16()
{
    var s = "";
    var idx = 0;
    var result = [];

    /* Utf16Inc tests { */
    result.push(RobbieTest_ArrayEquals(TextUtil.Utf16Inc(s, idx), [0, false, 0]));
    s = "A";
    idx = 0;
    result.push(RobbieTest_ArrayEquals(TextUtil.Utf16Inc(s, idx), [1, false, 65]));
    idx = 1;
    result.push(RobbieTest_ArrayEquals(TextUtil.Utf16Inc(s, idx), [1, false, 0]));

    s = "你";
    idx = 0;
    result.push(RobbieTest_ArrayEquals(TextUtil.Utf16Inc(s, idx), [1, false, 0x4f60]));

    s = "\ud835\udc9eA";
    idx = 0;
    result.push(RobbieTest_ArrayEquals(TextUtil.Utf16Inc(s, idx), [2, false, 0x1d49e]));
    idx = 2;
    result.push(RobbieTest_ArrayEquals(TextUtil.Utf16Inc(s, idx), [3, false, 65]));

    /* Negative tests { */
    s = "\udc9eA"; /* only the second character of a surrogate pair */
    idx = 0;
    result.push(RobbieTest_ArrayEquals(TextUtil.Utf16Inc(s, idx), [0, true, 0]));

    s = "\ud835A"; /* missing the second character of a surrogate pair */
    idx = 0;
    result.push(RobbieTest_ArrayEquals(TextUtil.Utf16Inc(s, idx), [0, true, 0]));

    s = "\ud835\ud835"; /* missing the second character of a surrogate pair */
    idx = 0;
    result.push(RobbieTest_ArrayEquals(TextUtil.Utf16Inc(s, idx), [0, true, 0]));

    s = "\ud835"; /* missing the second character of a surrogate pair */
    idx = 0;
    result.push(RobbieTest_ArrayEquals(TextUtil.Utf16Inc(s, idx), [0, true, 0]));
    /* } Negative tests */
    /* } Utf16Inc tests */

    /* Positive tests { */
    s = "A";
    result.push(RobbieTest_ArrayEquals(TextUtil.Utf16ToUtf8(s), ["41", false]));
    s = "\u00a0";
    result.push(RobbieTest_ArrayEquals(TextUtil.Utf16ToUtf8(s), ["c2a0", false]));
    s = "你";
    result.push(RobbieTest_ArrayEquals(TextUtil.Utf16ToUtf8(s), ["e4bda0", false]));
    s = "\ud835\udc9e";
    result.push(RobbieTest_ArrayEquals(TextUtil.Utf16ToUtf8(s), ["f09d929e", false]));
    s = "\ud835\udc9eA";
    result.push(RobbieTest_ArrayEquals(TextUtil.Utf16ToUtf8(s), ["f09d929e41", false]));
    /* } Positive tests */

    /* Negative tests { */
    s = "\ud835A"; /* missing the second character of a surrogate pair */
    result.push(RobbieTest_ArrayEquals(TextUtil.Utf16ToUtf8(s), [null, true]));
    /* } Negative tests */

    return result;
}

function RobbieTest_Utf8()
{
    var s = "";
    var i = 100;
    var result = [];

    /* Hexadecimal tests { */
    result.push(TextUtil.ByteToHex(255) == "ff"
             && TextUtil.ByteToHex(254) == "fe"
             && TextUtil.ByteToHex(240) == "f0"
             && TextUtil.ByteToHex(192) == "c0"
             && TextUtil.ByteToHex(193) == "c1"
             && TextUtil.ByteToHex(0)   == "00"
             && TextUtil.ByteToHex(1)   == "01"
             && TextUtil.ByteToHex(10)  == "0a"
             && TextUtil.ByteToHex(16)  == "10");
    result.push(TextUtil.HexToByte("ff") == 255
             && TextUtil.HexToByte("fe") == 254
             && TextUtil.HexToByte("Fe") == 254
             && TextUtil.HexToByte("fE") == 254
             && TextUtil.HexToByte("f0") == 240
             && TextUtil.HexToByte("c0") == 192
             && TextUtil.HexToByte("c1") == 193
             && TextUtil.HexToByte("00") ==   0
             && TextUtil.HexToByte("01") ==   1
             && TextUtil.HexToByte("0a") ==  10
             && TextUtil.HexToByte("10") ==  16
             && TextUtil.HexToByte("11 ") == 17
             && TextUtil.HexToByte("zz") ==  -1
             && TextUtil.HexToByte("  ") ==  -1
             && TextUtil.HexToByte(" a") ==  -1
             && TextUtil.HexToByte("a ") ==  -1
             && TextUtil.HexToByte("")   ==  -1);
    /* } Hexadecimal tests */

    /* Utf8Inc tests { */
    s = "41";
    idx = 0;
    result.push(RobbieTest_ArrayEquals(TextUtil.Utf8Inc(s, idx), [2, false, 65]));
    s = "c2a0"; /* non-breakable space */
    idx = 0;
    result.push(RobbieTest_ArrayEquals(TextUtil.Utf8Inc(s, idx), [4, false, 0xa0]));
    s = "c2a0e4bda0"; /* non-zero start position, "你" */
    idx = 4;
    result.push(RobbieTest_ArrayEquals(TextUtil.Utf8Inc(s, idx), [10, false, 0x4f60]));
    s = "c2a0f09d929e"; /* non-zero start position, non-BMP Unicode character */
    idx = 4;
    result.push(RobbieTest_ArrayEquals(TextUtil.Utf8Inc(s, idx), [12, false, 0x1d49e]));
    s = "eda0b5edb29e"; /* surrogate pair (any single one of them is not a valid character ) */
    idx = 0;
    result.push(RobbieTest_ArrayEquals(TextUtil.Utf8Inc(s, idx), [6, false, 0xd835]));
    idx = 6;
    result.push(RobbieTest_ArrayEquals(TextUtil.Utf8Inc(s, idx), [12, false, 0xdc9e]));
    /* Negative tests { */
    s = "a0"; /* invalid lead byte */
    idx = 0;
    result.push(RobbieTest_ArrayEquals(TextUtil.Utf8Inc(s, idx), [0, true, 0]));
    s = "eda0"; /* incomplete character */
    idx = 0;
    result.push(RobbieTest_ArrayEquals(TextUtil.Utf8Inc(s, idx), [0, true, 0]));
    s = "c2a0"; /* good character, but end of position */
    idx = 4;
    result.push(RobbieTest_ArrayEquals(TextUtil.Utf8Inc(s, idx), [4, false, 0]));
    s = "fca0a0a0a0a0"; /* too large code point */
    idx = 0;
    result.push(RobbieTest_ArrayEquals(TextUtil.Utf8Inc(s, idx), [0, true, 0]));
    /* } Negative tests */
    /* } Utf8Inc tests */

    /* Positive tests { */
    s = "eda0b5edb29e"; /* surrogate pair */
    result.push(RobbieTest_ArrayEquals(TextUtil.Utf8ToUtf16(s), [String.fromCharCode(0xD835) + String.fromCharCode(0xDC9E), false, false]));
    s = "f09d929e"; /* code point that expands to a surrogate pair */
    result.push(RobbieTest_ArrayEquals(TextUtil.Utf8ToUtf16(s), [String.fromCharCode(0xD835) + String.fromCharCode(0xDC9E), false, false]));
    s = "f09d929eeda0b5edb29e"; /* mixed case */
    result.push(RobbieTest_ArrayEquals(TextUtil.Utf8ToUtf16(s), [String.fromCharCode(0xD835) + String.fromCharCode(0xDC9E) + String.fromCharCode(0xD835) + String.fromCharCode(0xDC9E), false, false]));
    s = "414243"; /* simple case */
    result.push(RobbieTest_ArrayEquals(TextUtil.Utf8ToUtf16(s), ["ABC", false, false]));
    s = "e4bda0"; /* Chinese character */
    result.push(RobbieTest_ArrayEquals(TextUtil.Utf8ToUtf16(s), ["你", false, false]));
    /* } Positive tests */

    /* Negative tests { */
    s = "414"; /* invalid hexadecimal string */
    result.push(RobbieTest_ArrayEquals(TextUtil.Utf8ToUtf16(s), [null, true, false]));
    s = "414g"; /* invalid hexadecimal string */
    result.push(RobbieTest_ArrayEquals(TextUtil.Utf8ToUtf16(s), [null, true, false]));
    s = "fca0a0a0a0a0"; /* too large code point */
    result.push(RobbieTest_ArrayEquals(TextUtil.Utf8ToUtf16(s), [null, true, true]));
    /* } Negative tests */

    return result;
}

function RobbieTest_Base64()
{
    var s = "";
    var result = [];

    /* NOTE: no negative tests for Encode() and Decode(), because they don't
     * support negative cases */
    /* Encode() positive tests { */
    s = "A";
    result.push(Base64.EncodeString(s)[0] == "QQ==");
    s = "Ro";
    result.push(Base64.Encode(TextUtil.Utf16ToUtf8(s)[0]) == "Um8=");
    s = "你";
    result.push(Base64.Encode(TextUtil.Utf16ToUtf8(s)[0]) == "5L2g");
    s = "Hello world!";
    result.push(Base64.Encode(TextUtil.Utf16ToUtf8(s)[0]) == "SGVsbG8gd29ybGQh");
    s = "A quick brown fox jumps over a lazy dog. A quick brown fox jumps over a lazy dog.";
    result.push(Base64.Encode(TextUtil.Utf16ToUtf8(s)[0]) == "QSBxdWljayBicm93biBmb3gganVtcHMgb3ZlciBhIGxhenkgZG9nLiBBIHF1aWNrIGJyb3du\nIGZveCBqdW1wcyBvdmVyIGEgbGF6eSBkb2cu");
    /* } Encode() positive tests */
    /* Decode() positive tests { */
    s = "QQ==";
    result.push(Base64.DecodeString(s)[0] == "A");
    s = "Um8=";
    result.push(TextUtil.Utf8ToUtf16(Base64.Decode(s))[0] == "Ro");
    s = "5L2g";
    result.push(TextUtil.Utf8ToUtf16(Base64.Decode(s))[0] == "你");
    s = "SGVsbG8gd29ybGQh";
    result.push(TextUtil.Utf8ToUtf16(Base64.Decode(s))[0] == "Hello world!");
    s = "QSBxdWljayBicm93biBmb3gganVtcHMgb3ZlciBhIGxhenkgZG9nLiBBIHF1aWNrIGJyb3du\nIGZveCBqdW1wcyBvdmVyIGEgbGF6eSBkb2cu";
    result.push(TextUtil.Utf8ToUtf16(Base64.Decode(s))[0] == "A quick brown fox jumps over a lazy dog. A quick brown fox jumps over a lazy dog.");
    /* } Decode() positive tests */

    return result;
}

function RobbieTest_RunAll()
{
    var results = [];
    var result = [];
    var i;
    var j;
    var len;

    results.push(RobbieTest_Utf16());
    results.push(RobbieTest_Utf8());
    /* Base64 test depends on Utf16/Utf8 tests */
    results.push(RobbieTest_Base64());
    for (i = 0; i < results.length; ++i) {
        for (j = 0, len = results[i].length; j < len; ++j) {
            result.push(results[i][j]);
        }
    }
    return result;
}

function RobbieTest_ArrayEquals(arr1, arr2)
{
    var i;
    var len;
    var ret;

    if (arr1.length != arr2.length) {
        return false;
    }
    for (i = 0, len = arr1.length; i < len; ++i) {
        if ((arr1[i] != null && arr1[i].constructor == Array)
        &&  (arr2[i] != null && arr2[i].constructor == Array)) {
            /* special case: the element itself is an array */
            ret = RobbieTest_ArrayEquals(arr1[i], arr2[i]);
            if (!ret) {
                return ret;
            }
        } else if (arr1[i] != arr2[i]) {
            return false;
        }
    }
    return true;
}

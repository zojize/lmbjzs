{{
    function removeWsps(str) {
        return str.replace(/\s+/g, '');
    }
    function 夹(o1, o2, error) {
        const a = o1.array.slice();
        const b = o2.array.slice();
        const n = a.length;
        if (n <= 1)
            error(`一片${a[0]}夹不住东西啊！`);
        const m = b.length;
        if (m < n - 1) {
            if (m === 1 && (o2.text[0] !== '一' || (o2.text[1] === '一'))) {
                for (let i = 0; i < n - m - 1; i++) {
                    b.push(b[0]);
                }
            }
            else error(`${o2.text}太少了不够夹啊！`);
        }
        const result = [];
        const slots = [];
        const genA = a[Symbol.iterator]();
        const genB = b[Symbol.iterator]();
        for (let i = 0; i < n - 1; i++) {
            const item = genB.next().value;
            const slot = [item];
            slots.push(slot);
            result.push(genA.next().value, slot);
        }
        result.push(genA.next().value);
        const sLen = slots.length;
        let i = 0;
        for (const item of genB) {
            slots[i % sLen].push(item);
            i++;
        }
        return result.flat();
    }
    function arrayRepeat(arr, n){
        if(n <= 0) return [];
        let res = arr;
        for(let i = 0; i < n - 1; i++) {
            res = res.concat(arr);
        }
        return res;
    }
    const NMap = {
        一: 1,
        两: 2,
        三: 3,
        四: 4,
        五: 5,
        六: 6,
        七: 7,
        八: 8,
        九: 9,
        十: 10,
    }
    // const reversedNMap = Object
    //     .entries(NMap)
    //     .reduce((o, [k, v]) => Object.assign(o, { [v]: k }), {});
}}

两面包夹芝士     =
    wsps s:A和B wsps { return s }

A和B        =
    A:A夹B wsps 和 wsps B:A和B {
        return {
            text: removeWsps(text()),
            type: '和',
            array: [A.array, ...(B.type === '和' ? B.array : [B.array])]
        }
    } /
    s:A夹B {
        return {
            text: removeWsps(text()),
            type: s.type,
            array: s.array,
        }
    }

A夹B        =
    A:主要对象 wsps 夹 wsps B:A夹B {
        return {
            text: removeWsps(text()),
            type: '夹',
            array: 夹(A, B, error),
        }
    } /
    主要对象

主要对象       =
    N片面包或芝士 /
    "(" wsps s:A和B wsps ")" {
        return {
            text: removeWsps(text()),
            type: s.type,
            array: s.array,
        }
    } /
    "（" wsps s:A和B wsps "）" {
        return {
            text: removeWsps(text()),
            type: s.type,
            array: s.array,
        }
    }

N片面包或芝士      =
    n:N? wsps borc:面包或芝士  {
        return {
            text: removeWsps(text()),
            type: 'N',
            array: arrayRepeat(borc.array, n ?? 1),
        }
    }

面包或芝士 = (面包 / 芝士)


N          = ("一" / "两" / "三" / "四" / "五" / "六" / "七" / "八" / "九" / "十") { return NMap[text()] }

面包         = "面包" { return { text: "面包", type: "面包", array: ["面包"] } }
夹          = "夹"
芝士         = "芝士" { return { text: "芝士", type: "芝士", array: ["芝士"] } }

和          = "和"

wsps = wsp*
Zs  = [\u0020\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]
wsp =
  "\t"
  / "\v"
  / "\f"
  / " "
  / "\u00A0"
  / "\uFEFF"
  / "\n"
  / Zs
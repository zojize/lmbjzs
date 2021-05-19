// https://codepen.io/jakob-e/pen/doMoML
export function SVGTextToDataURL(txt: string): string {
    txt = txt
        .replace(
            "<svg",
            ~txt.indexOf("xmlns")
                ? "<svg"
                : '<svg xmlns="http://www.w3.org/2000/svg"'
        )
        //
        //   Encode (may need a few extra replacements)
        //
        .replace(/"/g, "'")
        .replace(/%/g, "%25")
        .replace(/#/g, "%23")
        .replace(/{/g, "%7B")
        .replace(/}/g, "%7D")
        .replace(/</g, "%3C")
        .replace(/>/g, "%3E")
        //
        // The maybe list (add on documented fail)
        //
        // .replace(/&/g, '%26')
        // .replace('|', '%7C')
        // .replace('[', '%5B')
        // .replace(']', '%5D')
        // .replace('^', '%5E')
        // .replace('`', '%60')
        // .replace(';', '%3B')
        // .replace('?', '%3F')
        // .replace(':', '%3A')
        // .replace('@', '%40')
        // .replace('=', '%3D')
        .replace(/\s+/g, " ");

    txt = `data:image/svg+xml,${txt}`;
    return txt;
}

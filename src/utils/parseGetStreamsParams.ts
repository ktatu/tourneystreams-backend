export const parseGetStreamsQueryParams = (params: unknown) => {
    if (!Array.isArray(params)) {
        throw new Error(`Parse error: expected array, was ${typeof params}`)
    }

    const parsedArray: Array<string> = []
    params.forEach((param) => {
        if (typeof param !== "string") {
            throw new Error(`Parse error: expected ${param} to be string, was ${typeof params}`)
        }
        parsedArray.push(param)
    })

    return parsedArray
}

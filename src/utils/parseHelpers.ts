export const parseString = (stringValue: unknown, key: string) => {
    if (typeof stringValue !== "string") {
        console.error("Value causing error: ", stringValue)
        throw new Error(`Key ${key}: expected string, was ${typeof stringValue}`)
    }

    return stringValue
}

export const parseNumber = (numValue: unknown, key: string) => {
    if (typeof numValue !== "number") {
        console.error("Value causing error: ", numValue)
        throw new Error(`Key ${key}: expected number, was ${typeof numValue}`)
    }

    return numValue
}

const validateError = (err: unknown) => {
    if (err instanceof Error) {
        return err
    }

    let stringified = "[Unable to stringify the thrown value]"
    try {
        stringified = JSON.stringify(err)
    } catch {
        // eslint-ignore-next-line
    }

    const error = new Error(`Caught error not instance of Error, stringified: ${stringified}`)
    return error
}

export default validateError

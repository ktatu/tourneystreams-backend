import PrettyError from "pretty-error"

const prettyError = new PrettyError()

prettyError.skipNodeFiles()
prettyError.skipPackage()

export default prettyError

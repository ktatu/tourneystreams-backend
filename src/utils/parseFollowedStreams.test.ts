import parseFollowedStreams from "./parseFollowedStreams"

let testRawDataArray: Array<unknown>

beforeEach(() => {
    testRawDataArray = [
        {
            game_name: "Just Chatting",
            title: "Streaming now!",
            user_login: "login_name1",
            user_name: "user_name1",
            viewer_count: 10,
        },
        {
            game_name: "Teamfight Tactics",
            title: "Learning a new game",
            user_login: "big_streamer",
            user_name: "Big Streamer",
            viewer_count: 10000,
        },
    ]
})

describe("parseFollowedStreams doesn't return a followed stream when", () => {
    test("its key game_name is malformatted", () => {
        testRawDataArray.push({
            game_name: { key: "shouldnt_exist" },
            title: "Testing purposes only!",
            user_login: "test_login",
            user_name: "Test Name",
            viewer_count: 1,
        })

        testRawDataArray.push({
            game_name: 0,
            title: "Testing purposes only!",
            user_login: "test_login2",
            user_name: "Test Name2",
            viewer_count: 1,
        })

        testRawDataArray.push({
            game_name: "",
            title: "Testing purposes only!",
            user_login: "test_login3",
            user_name: "Test Name3",
            viewer_count: 1,
        })

        const parsedStreams = parseFollowedStreams(testRawDataArray)

        expect(parsedStreams.map((stream) => stream.loginName)).not.toContain([
            "test_login",
            "test_login2",
            "test_login3",
        ])
    })
})

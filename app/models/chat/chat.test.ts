import { ChatModel } from "./chat"

test("can be created", () => {
  const instance = ChatModel.create({})

  expect(instance).toBeTruthy()
})

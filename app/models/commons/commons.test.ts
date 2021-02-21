import { CommonsModel } from "./commons"

test("can be created", () => {
  const instance = CommonsModel.create({})

  expect(instance).toBeTruthy()
})

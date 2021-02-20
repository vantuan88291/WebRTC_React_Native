import { Instance, types } from "mobx-state-tree"

export const DataChat = types.model({
  name: types.maybeNull(types.string),
  message: types.maybeNull(types.string),
})

type DataChatType = Instance<typeof DataChat>
export interface DataChatProps extends DataChatType {}

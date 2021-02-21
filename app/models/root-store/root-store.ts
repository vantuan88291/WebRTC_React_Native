import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { createChatDefaultModel } from "../chat/chat"
import { createCommonsDefaultModel } from "../commons/commons"

/**
 * A RootStore model.
 */
// prettier-ignore
export const RootStoreModel = types.model("RootStore").props({
  chat: createChatDefaultModel(),
  commons: createCommonsDefaultModel()
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}

/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}

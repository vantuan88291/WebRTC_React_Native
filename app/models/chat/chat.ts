import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { DataChat, DataChatProps } from "./chat.props"
import { emitSocket } from "../../utils/utils"

/**
 * Model description here for TypeScript hints.
 */
export const ChatModel = types
  .model("Chat")
  .props({
    data: types.optional(types.array(DataChat), []),
    msg: ''
  })
  .views(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions(self => ({
    pushMsg: (data: DataChatProps) => {
      self.data.push(data)
    },
    setData: (data: DataChatProps[]) => {
      self.data.replace(data)
    },
    setMsg: (text) => {
      self.msg = text
    },
    onSendMsg: () => {
      if (self.msg !== '') {
        emitSocket('sendmsg', {
          id: 1,
          name: 'Name',
          message: self.msg
        })
        self.msg = ''
      }
    }
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

/**
  * Un-comment the following to omit model attributes from your snapshots (and from async storage).
  * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

  * Note that you'll need to import `omit` from ramda, which is already included in the project!
  *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
  */

type ChatType = Instance<typeof ChatModel>
export interface Chat extends ChatType {}
type ChatSnapshotType = SnapshotOut<typeof ChatModel>
export interface ChatSnapshot extends ChatSnapshotType {}
export const createChatDefaultModel = () => types.optional(ChatModel, {})

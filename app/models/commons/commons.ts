import {applySnapshot, Instance, SnapshotOut, types} from "mobx-state-tree"
import common from "../../utils/common"
import {translate} from "../../i18n";

/**
 * Model description here for TypeScript hints.
 */
export const CommonsModel = types
  .model("Commons")
  .props({
    alert: types.optional(
      types.model({
        type: common.ALERT.info,
        title: "",
        message: "",
        payload: ""
      }),
      {},
    ),
  })
  .views(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions(self => ({
    resetAlert: () => {
      applySnapshot(self.alert, {})
    },
    push: (msg: string, title: string, payload: string) => {
      self.alert.message = msg || ""
      self.alert.type = common.ALERT.info
      self.alert.title = title ?? translate("common.notification")
      self.alert.payload = payload
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

/**
  * Un-comment the following to omit model attributes from your snapshots (and from async storage).
  * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

  * Note that you'll need to import `omit` from ramda, which is already included in the project!
  *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
  */

type CommonsType = Instance<typeof CommonsModel>
export interface Commons extends CommonsType {}
type CommonsSnapshotType = SnapshotOut<typeof CommonsModel>
export interface CommonsSnapshot extends CommonsSnapshotType {}
export const createCommonsDefaultModel = () => types.optional(CommonsModel, {})

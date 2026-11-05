import { FixedSizeVector } from "../fixedSizeVector.js";
export class Int32FlatVector extends FixedSizeVector {
    getValueFromBuffer(index) {
        return this.dataBuffer[index];
    }
}
//# sourceMappingURL=int32FlatVector.js.map
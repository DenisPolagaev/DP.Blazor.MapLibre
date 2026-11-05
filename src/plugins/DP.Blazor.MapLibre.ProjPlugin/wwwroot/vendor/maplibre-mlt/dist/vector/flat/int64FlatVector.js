import { FixedSizeVector } from "../fixedSizeVector.js";
export class Int64FlatVector extends FixedSizeVector {
    getValueFromBuffer(index) {
        return this.dataBuffer[index];
    }
}
//# sourceMappingURL=int64FlatVector.js.map
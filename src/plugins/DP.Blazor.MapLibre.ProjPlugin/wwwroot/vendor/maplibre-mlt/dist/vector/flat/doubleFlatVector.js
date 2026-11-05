import { FixedSizeVector } from "../fixedSizeVector.js";
export class DoubleFlatVector extends FixedSizeVector {
    getValueFromBuffer(index) {
        return this.dataBuffer[index];
    }
}
//# sourceMappingURL=doubleFlatVector.js.map
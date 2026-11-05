import { FixedSizeVector } from "../fixedSizeVector.js";
export class FloatFlatVector extends FixedSizeVector {
    getValueFromBuffer(index) {
        return this.dataBuffer[index];
    }
}
//# sourceMappingURL=floatFlatVector.js.map
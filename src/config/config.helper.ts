export class ConfigHelper {
  static getOrThrow(variableName: string): string {
    const variableValue = process.env[variableName];

    if (!variableValue) {
      throw new Error(`Empty ${variableName}`);
    }

    return variableValue;
  }
}

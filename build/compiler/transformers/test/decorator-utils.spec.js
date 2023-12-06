import ts from 'typescript';
import { getDecoratorParameters } from '../decorators-to-static/decorator-utils';
describe('decorator utils', () => {
    describe('getDecoratorParameters', () => {
        it('should return an empty array for decorator with no arguments', () => {
            const decorator = {
                expression: ts.factory.createIdentifier('DecoratorName'),
            };
            const typeCheckerMock = {};
            const result = getDecoratorParameters(decorator, typeCheckerMock);
            expect(result).toEqual([]);
        });
        it('should return correct parameters for decorator with multiple string arguments', () => {
            const decorator = {
                expression: ts.factory.createCallExpression(ts.factory.createIdentifier('DecoratorName'), undefined, [
                    ts.factory.createStringLiteral('arg1'),
                    ts.factory.createStringLiteral('arg2'),
                ]),
            };
            const typeCheckerMock = {};
            const result = getDecoratorParameters(decorator, typeCheckerMock);
            expect(result).toEqual(['arg1', 'arg2']);
        });
        it('should return enum value for enum member used in decorator', () => {
            const typeCheckerMock = {
                getTypeAtLocation: jest.fn(() => ({
                    value: 'arg1',
                    isLiteral: () => true,
                })),
            };
            const decorator = {
                expression: ts.factory.createCallExpression(ts.factory.createIdentifier('DecoratorName'), undefined, [
                    ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier('EnumName'), ts.factory.createIdentifier('EnumMemberName')),
                ]),
            };
            const result = getDecoratorParameters(decorator, typeCheckerMock);
            expect(result).toEqual(['arg1']);
        });
    });
});
//# sourceMappingURL=decorator-utils.spec.js.map
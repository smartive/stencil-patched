import { getStaticValue } from '../transform-utils';
export const parseStaticStates = (staticMembers) => {
    const parsedStates = getStaticValue(staticMembers, 'states');
    if (!parsedStates) {
        return [];
    }
    const stateNames = Object.keys(parsedStates);
    if (stateNames.length === 0) {
        return [];
    }
    return stateNames.map((stateName) => {
        return {
            name: stateName,
        };
    });
};
//# sourceMappingURL=states.js.map
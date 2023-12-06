import { h, newVNode } from '../h';
import { patch } from '../vdom-render';
describe('event listeners', () => {
    let hostElm;
    let vnode0;
    beforeEach(() => {
        hostElm = document.createElement('div');
        vnode0 = newVNode(null, null);
        vnode0.$elm$ = hostElm;
    });
    it('attaches click event handler to element', () => {
        const result = [];
        function clicked(ev) {
            result.push(ev);
        }
        const vnode = h('div', { onClick: clicked }, h('a', null, 'Click my parent'));
        patch(vnode0, vnode);
        hostElm.click();
        expect(result.length).toBe(1);
    });
    it('does not attach new listener', () => {
        const result = [];
        const vnode1 = h('div', {
            onClick: () => {
                result.push(1);
            },
        }, h('a', null, 'Click my parent'));
        const vnode2 = h('div', {
            onClick: () => {
                result.push(2);
            },
        }, h('a', null, 'Click my parent'));
        patch(vnode0, vnode1);
        hostElm.click();
        patch(vnode1, vnode2);
        hostElm.click();
        expect(result[0]).toBe(1);
        expect(result[1]).toBe(2);
    });
    it('detach attached click event handler to element', () => {
        const result = [];
        function clicked(ev) {
            result.push(ev);
        }
        const vnode1 = h('div', { onClick: clicked }, h('a', null, 'Click my parent'));
        patch(vnode0, vnode1);
        hostElm.click();
        hostElm.click();
        expect(result.length).toBe(2);
        const vnode2 = h('div', { o: {} }, h('a', null, 'Click my parent'));
        patch(vnode1, vnode2);
        hostElm.click();
        hostElm.click();
        expect(result.length).toBe(2);
    });
    it('shared handlers in parent and child nodes', () => {
        const result = [];
        function click(ev) {
            result.push(ev);
        }
        const vnode1 = h('div', { onClick: click }, h('a', { onClick: click }, 'Click my parent'));
        patch(vnode0, vnode1);
        hostElm.click();
        expect(result.length).toBe(1);
        hostElm.firstChild.click();
        expect(result.length).toBe(3);
    });
});
//# sourceMappingURL=event-listeners.spec.js.map
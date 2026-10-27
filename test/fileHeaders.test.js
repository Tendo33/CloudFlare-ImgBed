import assert from 'node:assert/strict';
import { setCommonHeaders, isScriptableDocumentType } from '../functions/file/fileTools.js';

describe('file response headers', () => {
    it('sandboxes script-capable uploads and sets nosniff', () => {
        for (const type of ['text/html; charset=utf-8', 'image/svg+xml', 'application/xhtml+xml']) {
            const h = new Headers();
            setCommonHeaders(h, 'x', type);
            assert.equal(h.get('Content-Security-Policy'), 'sandbox');
            assert.equal(h.get('X-Content-Type-Options'), 'nosniff');
        }
    });

    it('leaves ordinary images and PDFs unsandboxed', () => {
        for (const type of ['image/png', 'application/pdf', 'video/mp4']) {
            const h = new Headers();
            setCommonHeaders(h, 'x', type);
            assert.equal(h.get('Content-Security-Policy'), null);
            assert.equal(isScriptableDocumentType(type), false);
        }
    });
});

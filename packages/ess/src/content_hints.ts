import { AsnProp, AsnPropTypes } from '@peculiar/asn1-schema';
import { ContentType } from '@peculiar/asn1-cms';

/**
 * ```
 * ContentHints ::= SEQUENCE {
 *   contentDescription UTF8String (SIZE (1..MAX)) OPTIONAL,
 *   contentType ContentType }
 * ```
 * @todo - how to implement size?
 */
export class ContentHints {
    @AsnProp({ type: AsnPropTypes.Utf8String, optional: true })
    public contentDescription?: string;

    @AsnProp({ type: AsnPropTypes.ObjectIdentifier })
    public contentType: ContentType = '';

    constructor(params: Partial<ContentHints> = {}) {
        Object.assign(this, params);
    }
}

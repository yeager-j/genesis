import Interweave, { ChildrenNode, InterweaveProps, Matcher, MatchResponse, Node } from 'interweave';
import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Popover, Typography } from 'antd';

function transform(node: HTMLElement, children: Node[]): React.ReactNode {
    if (node.tagName.toLowerCase() === 'a') {
        return <Link to={node.getAttribute('href') as string}>{children}</Link>;
    }

    if (['h1', 'h2', 'h3', 'h4', 'h5'].includes(node.tagName.toLowerCase())) {
        const level = parseInt(node.tagName.substr(1, 1)) as 1 | 2 | 3 | 4 | 5;
        return <Typography.Title level={level}>{children}</Typography.Title>;
    }

    if (node.tagName.toLowerCase() === 'p') {
        if (children[0] && typeof children[0] !== 'string' && (children[0] as any).props.tagName === 'br') {
            return null;
        }

        return <Typography.Paragraph>{children}</Typography.Paragraph>;
    }

    // if (node.tagName.toLowerCase() === 'blockquote') {
    //     return (
    //         <Typography.Paragraph>
    //             <blockquote>{children}</blockquote>
    //         </Typography.Paragraph>
    //     );
    // }
}

class SpellMatcher extends Matcher<{}> {
    match(string: string): MatchResponse<{}> | null {
        const result = string.match(/(\[spell].+\[\/spell])/);

        if (!result) {
            return null;
        }

        return {
            index: result.index!,
            length: result[0].length,
            match: result[0],
            valid: true,
        };
    }

    replaceWith(children: ChildrenNode, props: any): Node {
        if (typeof children === 'string') {
            const content = children.replace('[spell]', '').replace('[/spell]', '');

            return (
                <Popover content="Hello World!" key={content}>
                    <Button type="link">{content}</Button>
                </Popover>
            );
        } else {
            return null;
        }
    }

    asTag(): string {
        return 'span';
    }
}

const spellMatcher = new SpellMatcher('spell');

const ContentRenderer = (props: InterweaveProps) => {
    return <Interweave transform={transform} matchers={[spellMatcher]} {...props} />;
};

export default ContentRenderer;
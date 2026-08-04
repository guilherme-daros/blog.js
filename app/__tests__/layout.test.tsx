import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RootLayout from '../layout';

vi.mock('next/font/google', () => ({
  Inter: () => ({ variable: 'mock-inter' }),
  JetBrains_Mono: () => ({ variable: 'mock-mono' }),
}));

describe('RootLayout', () => {
  it('renders children within html and body tags', () => {
    const Layout = RootLayout({ children: <div data-testid="child">Test</div> });
    
    // We render the HTML string to test if the tags are there, 
    // but testing full <html> rendering in JSDOM is tricky because JSDOM already has html/body.
    // So we just check the output structure or render its children.
    
    // In React Testing Library, rendering <html> directly sometimes strips the <html> tag,
    // so we can test the function return directly.
    expect(Layout.type).toBe('html');
    expect(Layout.props.className).toContain('mock-inter');
    expect(Layout.props.className).toContain('mock-mono');
    const head = Layout.props.children[0];
    const body = Layout.props.children[1];
    expect(head.type).toBe('head');
    expect(body.type).toBe('body');
    expect(body.props.children.props['data-testid']).toBe('child');
  });
});

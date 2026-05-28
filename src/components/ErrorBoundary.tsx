import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  fallback?: (error: Error, reset: () => void) => ReactNode;
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('ErrorBoundary caught:', error, info);
  }

  reset = () => this.setState({ error: null });

  render() {
    if (this.state.error) {
      if (this.props.fallback) return this.props.fallback(this.state.error, this.reset);
      return (
        <div
          role="alert"
          className="m-6 rounded-2xl border border-ink-200 bg-white p-6 shadow-card"
        >
          <h2 className="font-display text-xl font-bold text-ink-900">Something went wrong</h2>
          <p className="mt-2 text-ink-500">{this.state.error.message}</p>
          <button
            type="button"
            onClick={this.reset}
            className="mt-4 rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

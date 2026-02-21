import { Component, Suspense, lazy, useMemo } from 'react';
import { AlertTriangle, Globe } from 'lucide-react';
import WidgetSkeletonCard from '../common/WidgetSkeletonCard';
import WidgetStateCard from '../common/WidgetStateCard';

const Weather3D = lazy(() => import('./Weather3D'));

class Weather3DErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error('[Weather3D] render failed:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <WidgetStateCard
          title="3D Визуализация"
          icon={Globe}
          stateIcon={AlertTriangle}
          message="3D-виджет временно недоступен на этом устройстве."
          description="Основная панель погоды продолжает работать."
          tone="warning"
        />
      );
    }

    return this.props.children;
  }
}

const supportsWebGL = () => {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
};

const SafeWeather3D = ({ condition }) => {
  const webglSupported = useMemo(() => supportsWebGL(), []);

  if (!webglSupported) {
    return (
      <WidgetStateCard
        title="3D Визуализация"
        icon={Globe}
        stateIcon={AlertTriangle}
        message="WebGL не поддерживается в текущем браузере или устройстве."
        description="Переключитесь на современный браузер или устройство с поддержкой WebGL."
        tone="warning"
      />
    );
  }

  return (
    <Weather3DErrorBoundary>
      <Suspense
        fallback={<WidgetSkeletonCard title="3D Визуализация" icon={Globe} heightClass="h-80 sm:h-96" />}
      >
        <Weather3D condition={condition} />
      </Suspense>
    </Weather3DErrorBoundary>
  );
};

export default SafeWeather3D;

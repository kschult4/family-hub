import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LightCard from '../../components/home/LightCard';

describe('LightCard', () => {
  const mockDevice = {
    entity_id: 'light.living_room',
    state: 'off',
    attributes: {
      friendly_name: 'Living Room Light'
    }
  };

  const mockOnToggle = vi.fn();
  const mockOnLongPress = vi.fn();

  beforeEach(() => {
    mockOnToggle.mockClear();
    mockOnLongPress.mockClear();
  });

  it('should render light card with proper content', () => {
    render(
      <LightCard
        device={mockDevice}
        onToggle={mockOnToggle}
        onLongPress={mockOnLongPress}
      />
    );

    expect(screen.getByText('Light')).toBeInTheDocument();
    expect(screen.getByText('Living Room')).toBeInTheDocument();
  });

  it('should call onToggle when clicked', () => {
    render(
      <LightCard
        device={mockDevice}
        onToggle={mockOnToggle}
        onLongPress={mockOnLongPress}
      />
    );

    fireEvent.click(screen.getByText('Light').closest('div'));
    expect(mockOnToggle).toHaveBeenCalledWith('light.living_room');
  });

  it('should show animation when light is turned on', async () => {
    const onDevice = { ...mockDevice, state: 'on' };
    
    const { container } = render(
      <LightCard
        device={onDevice}
        onToggle={mockOnToggle}
        onLongPress={mockOnLongPress}
      />
    );

    // Check that ripple overlay is present for 'on' state
    const rippleOverlay = container.querySelector('.absolute.inset-0.z-0');
    expect(rippleOverlay).toBeInTheDocument();
  });

  it('should handle unavailable state', () => {
    const unavailableDevice = { ...mockDevice, state: 'unavailable' };
    
    const { container } = render(
      <LightCard
        device={unavailableDevice}
        onToggle={mockOnToggle}
        onLongPress={mockOnLongPress}
      />
    );

    // Find the main card container (first div)
    const card = container.firstChild;
    expect(card).toHaveClass('opacity-50', 'cursor-not-allowed');
  });
});
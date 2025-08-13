import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SwitchCard from '../../components/home/SwitchCard';

describe('SwitchCard', () => {
  const mockDevice = {
    entity_id: 'switch.coffee_maker',
    state: 'off',
    attributes: {
      friendly_name: 'Coffee Maker'
    }
  };

  const mockOnToggle = vi.fn();

  beforeEach(() => {
    mockOnToggle.mockClear();
  });

  it('should render switch card with proper content', () => {
    render(
      <SwitchCard
        device={mockDevice}
        onToggle={mockOnToggle}
      />
    );

    expect(screen.getByText('Coffee Maker')).toBeInTheDocument();
    expect(screen.getByText('Kitchen')).toBeInTheDocument();
  });

  it('should call onToggle when clicked', () => {
    render(
      <SwitchCard
        device={mockDevice}
        onToggle={mockOnToggle}
      />
    );

    fireEvent.click(screen.getByText('Coffee Maker').closest('div'));
    expect(mockOnToggle).toHaveBeenCalledWith('switch.coffee_maker');
  });

  it('should show animation when switch is turned on', async () => {
    const onDevice = { ...mockDevice, state: 'on' };
    
    const { container } = render(
      <SwitchCard
        device={onDevice}
        onToggle={mockOnToggle}
      />
    );

    // Check that ripple overlay is present for 'on' state
    const rippleOverlay = container.querySelector('.absolute.inset-0.z-0');
    expect(rippleOverlay).toBeInTheDocument();
  });

  it('should handle unavailable state', () => {
    const unavailableDevice = { ...mockDevice, state: 'unavailable' };
    
    const { container } = render(
      <SwitchCard
        device={unavailableDevice}
        onToggle={mockOnToggle}
      />
    );

    // Find the main card container (first div)
    const card = container.firstChild;
    expect(card).toHaveClass('opacity-50', 'cursor-not-allowed');
  });

  it('should use green color scheme', () => {
    const onDevice = { ...mockDevice, state: 'on' };
    
    const { container } = render(
      <SwitchCard
        device={onDevice}
        onToggle={mockOnToggle}
      />
    );

    // Check that the card has green border
    const card = container.firstChild;
    expect(card).toHaveClass('border-[#6aa968]');
    
    // Check that the button has green background
    const button = container.querySelector('[ref]');
    expect(button || container.querySelector('.bg-\\[\\#6aa968\\]')).toBeInTheDocument();
  });
});
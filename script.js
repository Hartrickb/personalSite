/**
 * Main script for personal website animations and interactivity
 * Handles element animations on scroll and responsive behavior
 */
document.addEventListener("DOMContentLoaded", () => {
	const boxes = document.querySelectorAll('.bento-box');
	const isLargeScreen = window.matchMedia("(min-width: 1200px)").matches;

	// Store original transform states to reset properly
	const originalTransforms = {};

	/**
	 * Initializes all elements with proper initial state based on screen size
	 * Large screens show all elements immediately, smaller screens prepare for scroll animations
	 */
	function initializeElements() {
		boxes.forEach(box => {
			// Save original transform if any
			originalTransforms[box.id] = box.style.transform || 'none';

			if (isLargeScreen) {
				// On large screens, make all boxes visible immediately with no scroll animations
				box.classList.add('visible');
				box.style.transform = originalTransforms[box.id];
			} else {
				// On smaller screens, prepare for scroll-based animations
				// Don't remove visible class, just set initial transform
				box.style.opacity = '0';
				box.style.transform = 'translateY(20px)';
			}
		});
	}

	/**
	 * Sets up scroll-based animations for smaller screens
	 * Uses IntersectionObserver to trigger animations when elements enter viewport
	 */
	function setupScrollAnimations() {
		if (isLargeScreen) return;

		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				const element = entry.target;
				const id = element.id;

				if (entry.isIntersecting) {
					// Base visibility animation
					element.classList.add('visible');
					element.style.opacity = '1';

					// Apply specialized animations based on element ID
					applyElementAnimation(element, id);
				} else {
					// Don't completely remove visibility, just reduce opacity
					// This prevents elements from disappearing suddenly
					element.style.opacity = '0.2';

					// Apply out-of-view transforms
					applyOutOfViewTransform(element, id);
					element.dataset.animated = 'false';
				}
			});
		}, {
			threshold: 0.1, // Reduced threshold for earlier detection
			rootMargin: '0px 0px -5% 0px' // Adjusted root margin
		});

		// Observe all bento boxes
		boxes.forEach(box => {
			observer.observe(box);
		});

		// Setup scroll-based parallax effects
		setupParallaxEffects();
	}

	/**
	 * Applies the appropriate animation to an element based on its ID
	 * Different elements receive different transform styles for visual variety
	 * @param {HTMLElement} element - The DOM element to animate
	 * @param {string} id - The ID of the element
	 */
	function applyElementAnimation(element, id) {
		switch (id) {
			case 'laptopBox':
			case 'jsonBox':
				element.dataset.animated = 'true';
				break;
			case 'statementBox':
				// Add slight rotation to statement box
				element.style.transform = 'scale(1.02) rotate(-1deg)';
				break;
			case 'experienceBox':
				// Add slight rotation to experience box
				element.style.transform = 'scale(1.02) rotate(-0.5deg)';
				break;
			case 'portfolioBox':
				element.style.transform = 'scale(1.05) rotate(-1deg)';
				break;
			case 'lunchFinder':
			case 'tenzies':
			case 'chefB':
				// Add upward movement for portfolio items
				element.style.transform = 'translateY(-10px)';
				break;
			default:
				// Default animation for other boxes
				element.style.transform = 'scale(1.02) rotate(1deg)';
		}
	}

	/**
	 * Applies subtle transform to elements that are scrolled out of view
	 * Prevents jarring transitions when elements leave the viewport
	 * @param {HTMLElement} element - The DOM element to transform
	 * @param {string} id - The ID of the element
	 */
	function applyOutOfViewTransform(element, id) {
		// Keep transformed elements visible but with reduced opacity
		// Don't reset transform completely to prevent jarring transitions
		if (element.classList.contains('visible')) {
			// Apply a subtle out-of-view transform that doesn't completely hide the element
			switch (id) {
				case 'lunchFinder':
				case 'tenzies':
				case 'chefB':
					element.style.transform = 'translateY(5px)';
					break;
				default:
					element.style.transform = 'translateY(10px) scale(0.98)';
			}
		}
	}

	/**
	 * Sets up parallax effects for elements based on scroll position
	 * Enhances the animation for elements already visible
	 */
	function setupParallaxEffects() {
		window.addEventListener('scroll', () => {
			const scrollPosition = window.scrollY;

			boxes.forEach(box => {
				const id = box.id;

				// Only apply parallax to elements that are currently visible/animated
				if (box.dataset.animated === 'true') {
					switch (id) {
						case 'laptopBox':
							// Smooth upward movement on scroll
							box.style.transform = `translateY(${Math.min(scrollPosition * 0.03, 20)}px)`;
							break;
						case 'jsonBox':
							// Smooth opposite direction movement
							box.style.transform = `translateY(${Math.max(scrollPosition * -0.02, -20)}px)`;
							break;
					}
				}
			});
		}, { passive: true }); // Add passive flag for better scroll performance
	}

	/**
	 * Sets up listener for window resize events to handle responsive behavior
	 * Reinitializes animations when screen size category changes
	 */
	function setupResizeListener() {
		window.addEventListener('resize', () => {
			const wasLargeScreen = isLargeScreen;
			const isLargeScreenNow = window.matchMedia("(min-width: 1200px)").matches;

			// Only reinitialize if screen size category changed
			if (wasLargeScreen !== isLargeScreenNow) {
				// Reset all transform styles to original state
				boxes.forEach(box => {
					box.style.transform = originalTransforms[box.id] || 'none';
					box.style.opacity = '1'; // Ensure opacity is reset
				});

				// Reinitialize with new screen size
				initializeElements();
				setupScrollAnimations();
			}
		});
	}

	// Initialize and setup
	initializeElements();
	setupScrollAnimations();
	setupResizeListener();
});

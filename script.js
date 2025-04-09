/**
 * Handles animation of elements as they enter the viewport
 * Applies consistent scroll-based animations to elements
 * Different animation types based on element ID and screen size
 */
document.addEventListener("DOMContentLoaded", () => {
	const boxes = document.querySelectorAll('.bento-box');
	const isLargeScreen = window.matchMedia("(min-width: 1200px)").matches;

	// Store original transform states to reset properly
	const originalTransforms = {};

	// Initialize all elements with proper initial state
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

	// Apply scroll-based animations for smaller screens
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
					switch (id) {
						case 'laptopBox':
							element.dataset.animated = 'true';
							break;
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
				} else {
					// Don't completely remove visibility, just reduce opacity
					// This prevents elements from disappearing suddenly
					element.style.opacity = '0.2';

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

					element.dataset.animated = 'false';
					// Don't remove the visible class to prevent jarring transitions
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

		// Handle parallax effects based on scroll position
		// This enhances the animation for elements already visible
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

	// Listen for window resize to handle responsive behavior
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

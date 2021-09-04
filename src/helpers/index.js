
export const getGameWidth = (scene) => scene.game.scale.width;

export const getGameHeight = (scene) => scene.game.scale.height;

/**
 * Get a fixed width/height size relative to the games dimensions
 * @param {number} size - Size of element
 * @param {scene} scene - Current scene
 * @returns {number} Number representing the fixed size relative to the games dimensions
 */
export const getRelative = (size, scene) => getGameHeight(scene) * size / 1080;


export const smartTrim = (string, maxLength) => {
	if (maxLength < 1) return string;
	if (string.length <= maxLength) return string;
	if (maxLength === 1) return `${string.substring(0, 1)}...`;
  
	const midpoint = Math.ceil(string.length / 2);
	const toremove = string.length - maxLength;
	const lstrip = Math.ceil(toremove / 2);
	const rstrip = toremove - lstrip;
	return `${string.substring(0, midpoint - lstrip)}...${string.substring(midpoint + rstrip)}`;
  };
  
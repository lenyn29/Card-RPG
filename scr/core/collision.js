// js/core/collision.js

export class CollisionSystem {
    static checkRectRect(rect1, rect2) {
        return (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y
        );
    }

    static moveAndSlide(entity, vx, vy, deltaTime, solidObstacles) {
        if (vx === 0 && vy === 0) return;

        let totalDx = vx * deltaTime;
        let totalDy = vy * deltaTime;

        let maxDistance = Math.max(Math.abs(totalDx), Math.abs(totalDy));
        let steps = Math.ceil(maxDistance / 4);
        if (steps < 1) steps = 1;
        if (steps > 16) steps = 16;

        let subDeltaX = totalDx / steps;
        let subDeltaY = totalDy / steps;

        for (let s = 0; s < steps; s++) {
            entity.x += subDeltaX;
            for (let obstacle of solidObstacles) {
                if (this.checkRectRect(entity, obstacle)) {
                    if (subDeltaX > 0) {
                        entity.x = obstacle.x - entity.width;
                    } else if (subDeltaX < 0) {
                        entity.x = obstacle.x + obstacle.width;
                    }
                    break;
                }
            }

            entity.y += subDeltaY;
            for (let obstacle of solidObstacles) {
                if (this.checkRectRect(entity, obstacle)) {
                    if (subDeltaY > 0) {
                        entity.y = obstacle.y - entity.height;
                    } else if (subDeltaY < 0) {
                        entity.y = obstacle.y + obstacle.height;
                    }
                    break;
                }
            }
        }
    }

    static resolveEntityEntity(e1, e2) {
        if (!this.checkRectRect(e1, e2)) return;

        let overlapX = (e1.width + e2.width) / 2 - Math.abs((e1.x + e1.width / 2) - (e2.x + e2.width / 2));
        let overlapY = (e1.height + e2.height) / 2 - Math.abs((e1.y + e1.height / 2) - (e2.y + e2.height / 2));

        if (overlapX > 0 && overlapY > 0) {
            if (overlapX < overlapY) {
                let push = overlapX / 2;
                if (e1.x < e2.x) {
                    e1.x -= push;
                    e2.x += push;
                } else {
                    e1.x += push;
                    e2.x -= push;
                }
            } else {
                let push = overlapY / 2;
                if (e1.y < e2.y) {
                    e1.y -= push;
                    e2.y += push;
                } else {
                    e1.y += push;
                    e2.y -= push;
                }
            }
        }
    }

    /**
     * Seguridad infalible: Si un empuje externo (knockback o colisión) mete a una entidad 
     * dentro de un muro, la expulsa inmediatamente hacia el borde más cercano.
     */
    static preventWallGlitch(entity, solidObstacles) {
        for (let obstacle of solidObstacles) {
            if (this.checkRectRect(entity, obstacle)) {
                // Calcular la distancia de penetración en cada dirección desde el centro
                let pLeft = (entity.x + entity.width) - obstacle.x;
                let pRight = (obstacle.x + obstacle.width) - entity.x;
                let pTop = (entity.y + entity.height) - obstacle.y;
                let pBottom = (obstacle.y + obstacle.height) - entity.y;

                // Encontrar la menor penetración para saber hacia dónde expulsarlo limpiamente
                let minPenetration = Math.min(pLeft, pRight, pTop, pBottom);

                if (minPenetration === pLeft) {
                    entity.x = obstacle.x - entity.width;
                } else if (minPenetration === pRight) {
                    entity.x = obstacle.x + obstacle.width;
                } else if (minPenetration === pTop) {
                    entity.y = obstacle.y - entity.height;
                } else if (minPenetration === pBottom) {
                    entity.y = obstacle.y + obstacle.height;
                }
            }
        }
    }
}
import Hero from "../types/hero";

export default class Database {
  heroStats: Hero | null = null;
  heroImage: any = null;

  setHeroStats(heroStats: Hero) {
    this.heroStats = heroStats;
  }

  getHeroStats() {
    return this.heroStats;
  }

  setHeroImage(image: any) {
    this.heroImage = image;
  }

  getHeroImage() {
    return this.heroImage;
  }
}

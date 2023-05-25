export class ConfigManager {
    private static config: any = {
        API_URL: "https://restaurant-pq2l.onrender.com"
    }

    static get(name: string) {
        return ConfigManager.config[name];
    }
}
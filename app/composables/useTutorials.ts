import { ref, computed } from "vue";

// Tipatge per a un tutorial
export interface Tutorial {
    id: number;
    title: string;
    description: string;
    category: string;
    icon: string;
    duration: string;
    date: string;
}

export function useTutorials() {
    // Estat reactiu
    const selectedCategory = ref<string>("Tots");

    const categories: string[] = [
        "Tots",
        "Producció",
        "Gravació",
        "Edició",
        "Mescla",
        "Disseny de so",
        "Harmonia",
        "Llenguatge musical",
    ];

    const tutorials = ref<Tutorial[]>([
        {
            id: 1,
            title: "Introducció a la Mescla: Conceptes Bàsics",
            description:
                "Aprèn els fonaments de la mescla: guany, equalització, compressió i panoràmica.",
            category: "Mescla",
            icon: "🎚️",
            duration: "15 min",
            date: "15 Nov 2024",
        },
        {
            id: 2,
            title: "Com Gravar Guitarres Elèctriques",
            description:
                "Tècniques de microfonació, col·locació i processament per aconseguir el millor so.",
            category: "Guitarra",
            icon: "🎸",
            duration: "22 min",
            date: "10 Nov 2024",
        },
        {
            id: 3,
            title: "Mastering per Streaming: Spotify i Apple Music",
            description:
                "Optimitza les teves cançons per les plataformes de streaming amb els nivells correctes.",
            category: "Mastering",
            icon: "💎",
            duration: "18 min",
            date: "5 Nov 2024",
        },
        {
            id: 4,
            title: "Producció de Baix: Sons Moderns",
            description:
                "Com aconseguir sons de baix potents i moderns per hip-hop, trap i electrònica.",
            category: "Baix",
            icon: "🎵",
            duration: "20 min",
            date: "1 Nov 2024",
        },
        {
            id: 5,
            title: "Teoria Musical per Productors",
            description:
                "Escales, acords i progressions harmòniques explicades de forma pràctica.",
            category: "Teoria",
            icon: "📚",
            duration: "30 min",
            date: "28 Oct 2024",
        },
        {
            id: 6,
            title: "Compressió Paral·lela en Bateries",
            description:
                "Tècnica avançada per aconseguir bateries amb punch i caràcter.",
            category: "Mescla",
            icon: "🥁",
            duration: "12 min",
            date: "25 Oct 2024",
        },
        {
            id: 7,
            title: "Arranjaments: Del Demo a la Cançó Final",
            description:
                "Aprèn a estructurar i arreglar les teves idees per crear cançons completes.",
            category: "Producció",
            icon: "🎹",
            duration: "25 min",
            date: "20 Oct 2024",
        },
        {
            id: 8,
            title: "Tècniques de Fingerstyle per Baix",
            description:
                "Millora la teva tècnica de dits i aconsegueix un so més dinàmic.",
            category: "Baix",
            icon: "🎸",
            duration: "18 min",
            date: "15 Oct 2024",
        },
    ]);

    // Computed filtrat per categoria
    const filteredTutorials = computed<Tutorial[]>(() => {
        if (selectedCategory.value === "Tots") return tutorials.value;
        return tutorials.value.filter(
            (t) => t.category === selectedCategory.value
        );
    });

    return {
        selectedCategory,
        categories,
        tutorials,
        filteredTutorials,
    };
}

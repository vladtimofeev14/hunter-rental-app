import React, { useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    Dimensions,
    TouchableOpacity,
} from "react-native";
import { colors, sizes } from "../../styles/globalStyles"; //

const { width } = Dimensions.get("window");

interface Slide {
    id: string;
    title: string;
    description: string;
    image: any;
}

const slides: Slide[] = [
    {
        id: "1",
        title: "Find your perfect match",
        description: "Find exactly what you need with an advanced search engine designed to match your specific preferences and location needs.",
        image: require("../../../assets/onboarding-one.png"),
    },
    {
        id: "2",
        title: "Search rentals your way",
        description: "Browse nearby listings using map views and advanced filters to find the perfect home.",
        image: require("../../../assets/onboarding-two.png"),
    },
    {
        id: "3",
        title: "One platform for everyone",
        description: "Whether you're renting or listing, create your profile and connect with the right opportunities.",
        image: require("../../../assets/onboarding-three.png"),
    },
];

export default function OnboardingScreen({ navigation }: any) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    const goToLogin = () => {
        navigation.replace("Login");
    };

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    const viewConfig = useRef({
        viewAreaCoveragePercentThreshold: 50,
    }).current;

    const nextSlide = () => {
        if (currentIndex < slides.length - 1) {
            flatListRef.current?.scrollToIndex({
                index: currentIndex + 1,
                animated: true,
            });
        }
    };

    const renderItem = ({ item }: { item: Slide }) => {
        return (
            <View style={styles.slide}>
                <Image source={item.image} style={styles.image} resizeMode="contain" />
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* SKIP BUTTON */}
            <TouchableOpacity style={styles.skipButton} onPress={goToLogin}>
                <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>

            {/* CAROUSEL */}
            <FlatList
                ref={flatListRef}
                data={slides}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewConfig}
            />

            {/* DOTS */}
            <View style={styles.dotsContainer}>
                {slides.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            currentIndex === index && styles.activeDot,
                        ]}
                    />
                ))}
            </View>

            {/* BOTTOM BUTTON */}
            <View style={styles.bottomContainer}>
                {currentIndex === slides.length - 1 ? (
                    <TouchableOpacity style={styles.primaryButton} onPress={goToLogin}>
                        <Text style={styles.primaryButtonText}>Get Started</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.primaryButton} onPress={nextSlide}>
                        <Text style={styles.primaryButtonText}>Next</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    skipButton: {
        position: "absolute",
        top: 60,
        right: 20,
        zIndex: 10,
    },
    skipText: {
        fontSize: sizes.medium,
        color: colors.primaryBlue,
        fontWeight: "500",
    },
    slide: {
        width,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    image: {
        width: width * 0.9,
        height: width * 0.9,
        marginBottom: 20,
    },
    title: {
        fontSize: sizes.large,
        fontWeight: "600",
        color: colors.black,
        textAlign: "center",
        marginBottom: 10,
    },
    description: {
        fontSize: sizes.small,
        textAlign: "center",
        color: colors.textSecondary,
        paddingHorizontal: 20,
        lineHeight: 22,
    },
    dotsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        paddingBottom: 20,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.lightBlueAccent,
        marginHorizontal: 5,
    },
    activeDot: {
        backgroundColor: colors.primaryBlue,
        width: 20,
        height: 8,
    },
    bottomContainer: {
        paddingHorizontal: 20,
        paddingBottom: 70,
    },
    primaryButton: {
        backgroundColor: colors.deepPurple,
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: "center",
    },
    primaryButtonText: {
        color: colors.white,
        fontSize: sizes.medium,
        fontWeight: "600",
    },
});
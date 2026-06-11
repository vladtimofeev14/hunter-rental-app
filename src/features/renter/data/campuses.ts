export type Campus = {
    id: string;
    name: string;
    city: string;
    province: string;
    lat: number;
    lng: number;
};

export const CAMPUSES: Campus[] = [
    {
        id: "gbc",
        name: "George Brown College",
        city: "Toronto",
        province: "ON",
        lat: 43.6505,
        lng: -79.3707,
    },
    {
        id: "uoft",
        name: "University of Toronto",
        city: "Toronto",
        province: "ON",
        lat: 43.6629,
        lng: -79.3957,
    },
    {
        id: "tm",
        name: "Toronto Metropolitan University",
        city: "Toronto",
        province: "ON",
        lat: 43.6577,
        lng: -79.3788,
    },
    {
        id: "york",
        name: "York University",
        city: "Toronto",
        province: "ON",
        lat: 43.7735,
        lng: -79.5019,
    },
    {
        id: "mcmaster",
        name: "McMaster University",
        city: "Hamilton",
        province: "ON",
        lat: 43.2609,
        lng: -79.9192,
    },
    {
        id: "waterloo",
        name: "University of Waterloo",
        city: "Waterloo",
        province: "ON",
        lat: 43.4723,
        lng: -80.5449,
    },
    {
        id: "western",
        name: "Western University",
        city: "London",
        province: "ON",
        lat: 43.0096,
        lng: -81.2737,
    },
    {
        id: "ottawa",
        name: "University of Ottawa",
        city: "Ottawa",
        province: "ON",
        lat: 45.4231,
        lng: -75.6831,
    },
    {
        id: "carleton",
        name: "Carleton University",
        city: "Ottawa",
        province: "ON",
        lat: 45.3876,
        lng: -75.6960,
    },
    {
        id: "queens",
        name: "Queen's University",
        city: "Kingston",
        province: "ON",
        lat: 44.2253,
        lng: -76.4951,
    },
];
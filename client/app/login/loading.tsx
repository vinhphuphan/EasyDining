import Spinner from "@/components/spinner";

export default function Loading() {
    // Next.js sẽ tự render file này khi route đang load (app router)
    return <Spinner />
}
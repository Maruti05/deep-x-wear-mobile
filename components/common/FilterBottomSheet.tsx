import { Colors } from "@/constants/theme";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface Props {
  selectedCategory: string | null;
  selectedGender: string | null;
  onApply: (category: string | null, gender: string | null) => void;
}

export const FilterBottomSheet = forwardRef<BottomSheetModal, Props>(
  ({ selectedCategory: initialCat, selectedGender: initialGen, onApply }, ref) => {
    const snapPoints = useMemo(() => [300, 500], []);
    const innerRef = useRef<BottomSheetModal>(null);

    // Expose BottomSheetModal methods via forwarded ref
  useImperativeHandle(ref, () => ({
  present: () => innerRef.current?.present(),
  dismiss: () => innerRef.current?.dismiss(),
  snapToIndex: (index: number) => innerRef.current?.snapToIndex(index),
  snapToPosition: (position: number) => innerRef.current?.snapToPosition(position),
  expand: () => innerRef.current?.expand(),
  collapse: () => innerRef.current?.collapse(),
}) as BottomSheetModalMethods);

    const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCat);
    const [selectedGender, setSelectedGender] = useState<string | null>(initialGen);

    useEffect(() => {
      setSelectedCategory(initialCat);
      setSelectedGender(initialGen);
    }, [initialCat, initialGen]);
console.log("ref", ref);

    return (
      <BottomSheetModal
        ref={innerRef}
        snapPoints={snapPoints}
        backgroundStyle={{ borderRadius: 24, backgroundColor: "white" }}
      >
        <View style={styles.sheetContent}>
          <Text style={styles.sheetTitle}>Filter</Text>

          {/* Category Chips */}
          <View style={styles.chipsRow}>
            {["Shirts", "Pants", "Shoes"].map((cat) => (
              <Pressable
                key={cat}
                style={[styles.chip, selectedCategory === cat && styles.chipSelected]}
                onPress={() => setSelectedCategory((prev) => (prev === cat ? null : cat))}
              >
                <Text style={{ color: selectedCategory === cat ? "white" : "black" }}>
                  {cat}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Gender Chips */}
          <View style={styles.chipsRow}>
            {["Men", "Women", "Unisex"].map((g) => (
              <Pressable
                key={g}
                style={[styles.chip, selectedGender === g && styles.chipSelected]}
                onPress={() => setSelectedGender((prev) => (prev === g ? null : g))}
              >
                <Text style={{ color: selectedGender === g ? "white" : "black" }}>{g}</Text>
              </Pressable>
            ))}
          </View>

          {/* Apply Button */}
          <Pressable
            style={styles.applyBtn}
            onPress={() => onApply(selectedCategory, selectedGender)}
          >
            <Text style={styles.applyText}>Apply</Text>
          </Pressable>
        </View>
      </BottomSheetModal>
    );
  }
);

const styles = StyleSheet.create({
  sheetContent: { flex: 1, padding: 20 },
  sheetTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginVertical: 8 },
  chip: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  chipSelected: { backgroundColor: Colors.light.tint, borderColor: Colors.light.tint },
  applyBtn: {
    marginTop: "auto",
    backgroundColor: Colors.light.tint,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  applyText: { color: "white", fontWeight: "bold", fontSize: 16 },
});

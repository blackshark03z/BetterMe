import React from 'react';
import { ScrollView, SafeAreaView } from 'react-native';
import { DatabaseTest } from '../src/components/DatabaseTest';

export default function TestDatabaseScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <DatabaseTest />
      </ScrollView>
    </SafeAreaView>
  );
} 
from server.workflows.introduce_workflow import SummaryNode


if __name__ == "__main__":
    result = SummaryNode().run("이동진의 여자친구는 어떤 사람이야?")
    print(result)